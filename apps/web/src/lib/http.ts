import { env } from '@/config/env'

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

// Backend geldiğinde servisler bu fonksiyonu kullanır.
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.VITE_API_URL ?? ''}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) throw new HttpError(response.status, await response.text())
  return (await response.json()) as T
}
