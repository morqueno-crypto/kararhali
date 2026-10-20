import type { PublicUser } from '@karar-hali/shared'
import type { Database } from './db/client'
import type { Env } from './env'
import type { createRateLimiter } from './lib/rate-limit'

export interface AppDeps {
  db: Database
  env: Env
  rateLimits: {
    login: ReturnType<typeof createRateLimiter>
    contact: ReturnType<typeof createRateLimiter>
  }
}

/** Hono bağlam tipleri: c.get('deps'), c.get('user') */
export interface AppBindings {
  Variables: {
    deps: AppDeps
    user: PublicUser
    sessionId: string
  }
}
