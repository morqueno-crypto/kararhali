import type { ApiErrorBody } from '@karar-hali/shared'
import { env } from './env'

/** API'nin döndüğü hata (gövdedeki code / message / details ile). */
export class HttpError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: unknown

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.details = details
  }

  /** Doğrulama hatalarındaki alan bazlı mesajlar: { alan: ['mesaj'] } */
  get fieldErrors(): Record<string, string[]> {
    const details = this.details as { fieldErrors?: Record<string, string[]> } | undefined
    return details?.fieldErrors ?? {}
  }
}

interface HttpOptions extends Omit<RequestInit, 'body'> {
  /** Verilirse JSON olarak gönderilir. */
  json?: unknown
  /** multipart/form-data gövdesi (dosya yükleme) */
  form?: FormData
}

/** API isteği: oturum çerezi gönderilir, hata gövdesi HttpError'a çevrilir. */
export async function http<T>(
  path: string,
  { json, form, headers, ...init }: HttpOptions = {},
): Promise<T> {
  const response = await fetch(`${env.VITE_API_URL ?? ''}/api/v1${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(json === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: form ?? (json === undefined ? undefined : JSON.stringify(json)),
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new HttpError(
      response.status,
      body?.error.code ?? 'http_error',
      body?.error.message ?? response.statusText,
      body?.error.details,
    )
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/** Kullanıcıya gösterilecek hata metni */
export function errorMessage(error: unknown) {
  if (error instanceof HttpError) {
    if (error.status === 403) return 'Bu işlem için yetkiniz yok.'
    if (error.code === 'validation_error') return 'Bazı alanlar geçersiz. Lütfen kontrol edin.'
    return error.message
  }
  if (error instanceof TypeError) return 'Sunucuya ulaşılamadı. API çalışıyor mu?'
  return 'Beklenmeyen bir hata oluştu.'
}
