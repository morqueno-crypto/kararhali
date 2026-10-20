import type { ApiErrorBody } from '@karar-hali/shared'
import { env } from '@/config/env'

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
}

interface HttpOptions extends Omit<RequestInit, 'body'> {
  /** Verilirse JSON olarak gönderilir. */
  json?: unknown
}

/** API isteği. Çerezler gönderilir (admin oturumu için); hata gövdesi HttpError'a çevrilir. */
export async function http<T>(
  path: string,
  { json, headers, ...init }: HttpOptions = {},
): Promise<T> {
  const response = await fetch(`${env.VITE_API_URL ?? ''}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(json === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: json === undefined ? undefined : JSON.stringify(json),
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

/** 404'ü "bulunamadı" (undefined) olarak döner; diğer hataları fırlatır. */
export async function httpOptional<T>(path: string, options?: HttpOptions): Promise<T | undefined> {
  try {
    return await http<T>(path, options)
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return undefined
    throw error
  }
}
