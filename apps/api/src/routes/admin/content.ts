import { contentKeySchema, contentKeys, settingKeySchema, settingKeys } from '@karar-hali/shared'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../context'
import { contentBlocks, settings } from '../../db/schema'
import { validate } from '../../lib/validate'
import { requireRole } from '../../middleware/auth'
import { parseContentBlock } from '../../services/content'
import { parseSetting } from '../../services/settings'

const anyJson = z.unknown()

/** Sayfa içerikleri (TR/EN). Doğrulama anahtar başına @karar-hali/shared şemalarıyla yapılır. */
export const contentRoutes = new Hono<AppBindings>()
  /** Tüm anahtarlar; henüz kaydı olmayanlar data: null ile döner. */
  .get('/', async (c) => {
    const rows = await c.get('deps').db.select().from(contentBlocks)
    const byKey = new Map(rows.map((row) => [row.key, row]))
    return c.json({
      items: contentKeys.map((key) => ({
        key,
        data: byKey.get(key)?.data ?? null,
        updatedAt: byKey.get(key)?.updatedAt ?? null,
      })),
    })
  })

  .get('/:key', validate('param', z.object({ key: contentKeySchema })), async (c) => {
    const { key } = c.req.valid('param')
    const [row] = await c
      .get('deps')
      .db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.key, key))
    return c.json({ key, data: row?.data ?? null, updatedAt: row?.updatedAt ?? null })
  })

  .put(
    '/:key',
    validate('param', z.object({ key: contentKeySchema })),
    validate('json', anyJson),
    async (c) => {
      const { key } = c.req.valid('param')
      const data = parseContentBlock(key, c.req.valid('json'))
      const userId = c.get('user').id
      const [row] = await c
        .get('deps')
        .db.insert(contentBlocks)
        .values({ key, data, updatedBy: userId })
        .onConflictDoUpdate({
          target: contentBlocks.key,
          set: { data, updatedBy: userId, updatedAt: new Date().toISOString() },
        })
        .returning()
      return c.json({ key, data: row!.data, updatedAt: row!.updatedAt })
    },
  )

/** Site ayarları (iletişim, sosyal medya, genel). Yalnızca owner ve admin. */
export const settingsRoutes = new Hono<AppBindings>()
  .use('*', requireRole('owner', 'admin'))

  .get('/', async (c) => {
    const rows = await c.get('deps').db.select().from(settings)
    const byKey = new Map(rows.map((row) => [row.key, row]))
    return c.json({
      items: settingKeys.map((key) => ({
        key,
        value: byKey.get(key)?.value ?? null,
        updatedAt: byKey.get(key)?.updatedAt ?? null,
      })),
    })
  })

  .put(
    '/:key',
    validate('param', z.object({ key: settingKeySchema })),
    validate('json', anyJson),
    async (c) => {
      const { key } = c.req.valid('param')
      const value = parseSetting(key, c.req.valid('json'))
      const userId = c.get('user').id
      const [row] = await c
        .get('deps')
        .db.insert(settings)
        .values({ key, value, updatedBy: userId })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value, updatedBy: userId, updatedAt: new Date().toISOString() },
        })
        .returning()
      return c.json({ key, value: row!.value, updatedAt: row!.updatedAt })
    },
  )
