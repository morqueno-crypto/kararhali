import { createUserInputSchema, idParamSchema, updateUserInputSchema } from '@karar-hali/shared'
import { asc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { AppBindings } from '../../context'
import { users } from '../../db/schema'
import { conflict, forbidden, notFound } from '../../lib/errors'
import { hashPassword } from '../../lib/password'
import { revokeUserSessions, toPublicUser } from '../../lib/session'
import { validate } from '../../lib/validate'
import { requireRole } from '../../middleware/auth'

/**
 * Üyelik yönetimi — YALNIZCA owner.
 * Owner kaydı bu uçlardan değiştirilemez/silinemez (kendi şifresi için /auth/change-password).
 */
export const usersRoutes = new Hono<AppBindings>()
  .use('*', requireRole('owner'))

  .get('/', async (c) => {
    const rows = await c.get('deps').db.select().from(users).orderBy(asc(users.id))
    return c.json({ items: rows.map(toPublicUser) })
  })

  .post('/', validate('json', createUserInputSchema), async (c) => {
    const { db } = c.get('deps')
    const input = c.req.valid('json')
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, input.email))
    if (existing) throw conflict('Bu e-posta ile kayıtlı bir kullanıcı var')

    const [created] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        role: input.role,
        passwordHash: await hashPassword(input.password),
      })
      .returning()
    return c.json({ user: toPublicUser(created!) }, 201)
  })

  .patch(
    '/:id',
    validate('param', idParamSchema),
    validate('json', updateUserInputSchema),
    async (c) => {
      const { db } = c.get('deps')
      const { id } = c.req.valid('param')
      const input = c.req.valid('json')

      const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1)
      if (!target) throw notFound('Kullanıcı bulunamadı')
      if (target.role === 'owner') throw forbidden('Ana kullanıcı bu uçtan değiştirilemez')

      const [updated] = await db
        .update(users)
        .set({
          name: input.name,
          role: input.role,
          active: input.active,
          passwordHash: input.password ? await hashPassword(input.password) : undefined,
        })
        .where(eq(users.id, id))
        .returning()

      // Pasifleştirilen veya şifresi sıfırlanan kullanıcının açık oturumları kapatılır.
      if (input.active === false || input.password) await revokeUserSessions(c, id)
      return c.json({ user: toPublicUser(updated!) })
    },
  )

  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const { db } = c.get('deps')
    const { id } = c.req.valid('param')
    const [target] = await db.select().from(users).where(eq(users.id, id)).limit(1)
    if (!target) throw notFound('Kullanıcı bulunamadı')
    if (target.role === 'owner') throw forbidden('Ana kullanıcı silinemez')

    await db.delete(users).where(eq(users.id, id))
    return c.body(null, 204)
  })
