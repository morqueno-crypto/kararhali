import { serve } from '@hono/node-server'
import { createApp } from './app'
import { configureSqlite, createDatabase } from './db/client'
import { runMigrations } from './db/migrate'
import { loadEnv } from './env'
import { createRateLimiter } from './lib/rate-limit'

const env = loadEnv()
const db = createDatabase(env.DATABASE_URL)
await configureSqlite(db)
// Sunucu her açılışta bekleyen migration'ları uygular.
await runMigrations(db)

const app = createApp({
  db,
  env,
  rateLimits: {
    login: createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 }),
    contact: createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 }),
  },
})

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Karar Halı API → http://localhost:${info.port}/api/v1 (${env.NODE_ENV})`)
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0))
  })
}
