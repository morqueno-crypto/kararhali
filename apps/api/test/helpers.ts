import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../src/app'
import { configureSqlite, createDatabase } from '../src/db/client'
import { runMigrations } from '../src/db/migrate'
import { seedDatabase } from '../src/db/seed'
import { loadEnv } from '../src/env'
import { createRateLimiter } from '../src/lib/rate-limit'

/** Testlerde gövde alanlarına doğrudan erişebilmek için json() any döner. */
export interface TestResponse extends Omit<Response, 'json'> {
  json(): Promise<any>
}

// Yalnızca testlerde kullanılan sahte kimlik bilgileri.
export const OWNER = {
  email: 'owner@test.local',
  name: 'Test Owner',
  password: 'owner-password-123',
}

/** Bellek içi veritabanı + migration + seed ile izole bir uygulama örneği. */
export async function createTestApp() {
  const env = loadEnv({
    NODE_ENV: 'test',
    DATABASE_URL: ':memory:',
    UPLOAD_DIR: mkdtempSync(join(tmpdir(), 'karar-uploads-')),
    CORS_ORIGINS: 'http://localhost:5173',
  })
  const db = createDatabase(env.DATABASE_URL)
  await configureSqlite(db)
  await runMigrations(db)
  await seedDatabase(db, OWNER)

  const app = createApp({
    db,
    env,
    rateLimits: {
      login: createRateLimiter({ limit: 5, windowMs: 60_000 }),
      contact: createRateLimiter({ limit: 3, windowMs: 60_000 }),
    },
  })

  /** Tarayıcı gibi davranır: değiştirici isteklerde Origin başlığı gönderir (CSRF kontrolü). */
  async function request(
    path: string,
    init: RequestInit & { cookie?: string; json?: unknown } = {},
  ): Promise<TestResponse> {
    const headers = new Headers(init.headers)
    if (init.cookie) headers.set('cookie', init.cookie)
    if (init.method && init.method !== 'GET' && !headers.has('origin')) {
      headers.set('origin', 'http://localhost:5173')
    }
    let body = init.body
    if (init.json !== undefined) {
      headers.set('content-type', 'application/json')
      body = JSON.stringify(init.json)
    }
    return (await app.request(path, { ...init, headers, body })) as TestResponse
  }

  /** Giriş yapar ve sonraki isteklerde kullanılacak çerez başlığını döner. */
  async function login(email: string, password: string) {
    const response = await request('/api/v1/auth/login', {
      method: 'POST',
      json: { email, password },
    })
    if (response.status !== 200) throw new Error(`Giriş başarısız: ${response.status}`)
    const setCookie = response.headers.get('set-cookie') ?? ''
    return setCookie.split(';')[0]!
  }

  return { app, db, env, request, login }
}
