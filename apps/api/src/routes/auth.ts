import { changePasswordInputSchema, loginInputSchema } from '@karar-hali/shared'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { AppBindings } from '../context'
import { users } from '../db/schema'
import { badRequest, unauthorized } from '../lib/errors'
import { hashPassword, verifyPassword } from '../lib/password'
import { getClientIp } from '../lib/request'
import { createSession, destroySession, revokeUserSessions, toPublicUser } from '../lib/session'
import { validate } from '../lib/validate'
import { requireAuth } from '../middleware/auth'

// Kullanıcı bulunamadığında da bir doğrulama yapılır; böylece yanıt süresi
// e-postanın kayıtlı olup olmadığını ele vermez.
let dummyHash: Promise<string> | undefined
const getDummyHash = () => (dummyHash ??= hashPassword('karar-timing-equalizer'))

/** Oturum işlemleri. Hesap oluşturma yoktur: kullanıcıları yalnızca owner panelden açar. */
export const authRoutes = new Hono<AppBindings>()
  .post('/login', validate('json', loginInputSchema), async (c) => {
    const { db, env, rateLimits } = c.get('deps')
    const { email, password } = c.req.valid('json')
    const limitKey = `${getClientIp(c, env.TRUST_PROXY)}:${email}`
    rateLimits.login.hit(limitKey)

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const valid = user
      ? await verifyPassword(user.passwordHash, password)
      : await verifyPassword(await getDummyHash(), password).then(() => false)

    if (!user || !valid || !user.active) throw unauthorized('E-posta veya şifre hatalı')

    rateLimits.login.reset(limitKey)
    const lastLoginAt = new Date().toISOString()
    await db.update(users).set({ lastLoginAt }).where(eq(users.id, user.id))
    await createSession(c, user.id)
    return c.json({ user: toPublicUser({ ...user, lastLoginAt }) })
  })

  .post('/logout', async (c) => {
    await destroySession(c)
    return c.body(null, 204)
  })

  .get('/me', requireAuth, (c) => c.json({ user: c.get('user') }))

  /** Kendi şifresini değiştirir; diğer cihazlardaki oturumlar kapatılır. */
  .post('/change-password', requireAuth, validate('json', changePasswordInputSchema), async (c) => {
    const { db } = c.get('deps')
    const { currentPassword, newPassword } = c.req.valid('json')
    const current = c.get('user')

    const [row] = await db.select().from(users).where(eq(users.id, current.id)).limit(1)
    if (!row || !(await verifyPassword(row.passwordHash, currentPassword))) {
      throw badRequest('Mevcut şifre hatalı', {
        fieldErrors: { currentPassword: ['Mevcut şifre hatalı'] },
      })
    }
    await db
      .update(users)
      .set({ passwordHash: await hashPassword(newPassword) })
      .where(eq(users.id, current.id))
    await revokeUserSessions(c, current.id, c.get('sessionId'))
    return c.json({ ok: true })
  })
