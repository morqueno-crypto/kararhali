import type { ApiErrorBody } from '@karar-hali/shared'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/** Bilinçli olarak fırlatılan, istemciye gösterilebilir hata. */
export class HttpError extends Error {
  readonly status: ContentfulStatusCode
  readonly code: string
  readonly details?: unknown

  constructor(status: ContentfulStatusCode, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new HttpError(400, 'bad_request', message, details)
export const unauthorized = (message = 'Oturum açmanız gerekiyor') =>
  new HttpError(401, 'unauthorized', message)
export const forbidden = (message = 'Bu işlem için yetkiniz yok') =>
  new HttpError(403, 'forbidden', message)
export const notFound = (message = 'Kayıt bulunamadı') => new HttpError(404, 'not_found', message)
export const conflict = (message: string) => new HttpError(409, 'conflict', message)
export const tooManyRequests = (message = 'Çok fazla deneme. Lütfen biraz sonra tekrar deneyin.') =>
  new HttpError(429, 'too_many_requests', message)

export function errorBody(code: string, message: string, details?: unknown): ApiErrorBody {
  return { error: { code, message, ...(details === undefined ? {} : { details }) } }
}

/** Hatanın ve sarmaladığı nedenlerin (error.cause zinciri) mesajları; Drizzle SQLite hatasını sarar. */
function messageChain(error: unknown) {
  const messages: string[] = []
  let current: unknown = error
  for (let depth = 0; current instanceof Error && depth < 5; depth += 1) {
    messages.push(current.message)
    current = current.cause
  }
  return messages.join(' | ')
}

/** Hono onError: bilinen hatalar olduğu gibi, bilinmeyenler 500 olarak döner (ayrıntı sızdırılmaz). */
export function handleError(error: Error, c: Context) {
  if (error instanceof HttpError) {
    return c.json(errorBody(error.code, error.message, error.details), error.status)
  }
  // Hono ara katmanlarının hataları (ör. CSRF → 403)
  if (error instanceof HTTPException) {
    const status = error.status as ContentfulStatusCode
    const message =
      status === 403 ? 'İsteğin kaynağı doğrulanamadı' : error.message || 'İstek reddedildi'
    return c.json(errorBody(status === 403 ? 'forbidden' : 'http_error', message), status)
  }
  const messages = messageChain(error)
  // SQLite benzersizlik ihlali (ör. aynı slug)
  if (/UNIQUE constraint failed/i.test(messages)) {
    return c.json(errorBody('conflict', 'Bu değer zaten kullanılıyor'), 409)
  }
  if (/FOREIGN KEY constraint failed/i.test(messages)) {
    return c.json(
      errorBody('conflict', 'Kayıt başka kayıtlarla ilişkili olduğu için işlem yapılamadı'),
      409,
    )
  }
  console.error(error)
  return c.json(errorBody('internal_error', 'Beklenmeyen bir hata oluştu'), 500)
}
