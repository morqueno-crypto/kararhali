import {
  idParamSchema,
  messageStatusSchema,
  messageUpdateSchema,
  paginationQuerySchema,
} from '@karar-hali/shared'
import { count, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { AppBindings } from '../../context'
import { contactMessages } from '../../db/schema'
import { notFound } from '../../lib/errors'
import { validate } from '../../lib/validate'
import { requireRole } from '../../middleware/auth'

/** İletişim formu mesajları. Yalnızca owner ve admin. */
export const messagesRoutes = new Hono<AppBindings>()
  .use('*', requireRole('owner', 'admin'))

  .get(
    '/',
    validate('query', paginationQuerySchema.extend({ status: messageStatusSchema.optional() })),
    async (c) => {
      const { db } = c.get('deps')
      const { page, pageSize, status } = c.req.valid('query')
      const where = status ? eq(contactMessages.status, status) : undefined
      const [items, [total]] = await Promise.all([
        db
          .select()
          .from(contactMessages)
          .where(where)
          .orderBy(desc(contactMessages.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        db.select({ value: count() }).from(contactMessages).where(where),
      ])
      return c.json({ items, page, pageSize, total: total?.value ?? 0 })
    },
  )

  .get('/:id', validate('param', idParamSchema), async (c) => {
    const [message] = await c
      .get('deps')
      .db.select()
      .from(contactMessages)
      .where(eq(contactMessages.id, c.req.valid('param').id))
    if (!message) throw notFound('Mesaj bulunamadı')
    return c.json({ message })
  })

  .patch(
    '/:id',
    validate('param', idParamSchema),
    validate('json', messageUpdateSchema),
    async (c) => {
      const [message] = await c
        .get('deps')
        .db.update(contactMessages)
        .set(c.req.valid('json'))
        .where(eq(contactMessages.id, c.req.valid('param').id))
        .returning()
      if (!message) throw notFound('Mesaj bulunamadı')
      return c.json({ message })
    },
  )

  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const [deleted] = await c
      .get('deps')
      .db.delete(contactMessages)
      .where(eq(contactMessages.id, c.req.valid('param').id))
      .returning()
    if (!deleted) throw notFound('Mesaj bulunamadı')
    return c.body(null, 204)
  })
