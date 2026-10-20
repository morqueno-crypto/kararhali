import type { Role } from '@karar-hali/shared'
import { createMiddleware } from 'hono/factory'
import type { AppBindings } from '../context'
import { forbidden, unauthorized } from '../lib/errors'
import { loadSession } from '../lib/session'

/** Oturum zorunlu; c.get('user') ve c.get('sessionId') ayarlanır. */
export const requireAuth = createMiddleware<AppBindings>(async (c, next) => {
  const session = await loadSession(c)
  if (!session) throw unauthorized()
  c.set('user', session.user)
  c.set('sessionId', session.sessionId)
  await next()
})

/** requireAuth'tan SONRA kullanılır. */
export function requireRole(...allowed: Role[]) {
  return createMiddleware<AppBindings>(async (c, next) => {
    if (!allowed.includes(c.get('user').role)) throw forbidden()
    await next()
  })
}
