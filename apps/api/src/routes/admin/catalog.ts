import {
  collectionInputSchema,
  collectionUpdateSchema,
  colorInputSchema,
  colorKeySchema,
  colorUpdateSchema,
  idParamSchema,
  modelInputSchema,
  modelUpdateSchema,
  reorderSchema,
} from '@karar-hali/shared'
import { asc, count, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../../context'
import type { Database } from '../../db/client'
import { collections, colors, models } from '../../db/schema'
import { badRequest, notFound } from '../../lib/errors'
import { slugify } from '../../lib/slug'
import { validate } from '../../lib/validate'

async function assertColorExists(db: Database, key: string) {
  const [color] = await db.select({ key: colors.key }).from(colors).where(eq(colors.key, key))
  if (!color) {
    throw badRequest('Renk bulunamadı', { fieldErrors: { colorKey: ['Önce rengi ekleyin'] } })
  }
}

/** Sıralama: verilen kimlik sırasına göre sortOrder = 0, 1, 2 ... */
async function applyOrder(db: Database, table: typeof collections | typeof models, ids: number[]) {
  await db.transaction(async (tx) => {
    for (const [index, id] of ids.entries()) {
      await tx.update(table).set({ sortOrder: index }).where(eq(table.id, id))
    }
  })
}

// ── Renkler ─────────────────────────────────────────────────────────────
export const colorsRoutes = new Hono<AppBindings>()
  .get('/', async (c) => {
    const items = await c.get('deps').db.select().from(colors).orderBy(asc(colors.key))
    return c.json({ items })
  })
  .post('/', validate('json', colorInputSchema), async (c) => {
    const [color] = await c.get('deps').db.insert(colors).values(c.req.valid('json')).returning()
    return c.json({ color }, 201)
  })
  .patch(
    '/:key',
    validate('param', z.object({ key: colorKeySchema })),
    validate('json', colorUpdateSchema),
    async (c) => {
      const [color] = await c
        .get('deps')
        .db.update(colors)
        .set(c.req.valid('json'))
        .where(eq(colors.key, c.req.valid('param').key))
        .returning()
      if (!color) throw notFound('Renk bulunamadı')
      return c.json({ color })
    },
  )
  /** Modellerde kullanılan renk silinemez (409). */
  .delete('/:key', validate('param', z.object({ key: colorKeySchema })), async (c) => {
    const [deleted] = await c
      .get('deps')
      .db.delete(colors)
      .where(eq(colors.key, c.req.valid('param').key))
      .returning()
    if (!deleted) throw notFound('Renk bulunamadı')
    return c.body(null, 204)
  })

// ── Koleksiyonlar ───────────────────────────────────────────────────────
export const collectionsRoutes = new Hono<AppBindings>()
  /** Tümü (yayında olmayanlar dahil) + model sayısı */
  .get('/', async (c) => {
    const { db } = c.get('deps')
    const rows = await db
      .select({ collection: collections, modelCount: count(models.id) })
      .from(collections)
      .leftJoin(models, eq(models.collectionId, collections.id))
      .groupBy(collections.id)
      .orderBy(asc(collections.sortOrder), asc(collections.id))
    return c.json({ items: rows.map((row) => ({ ...row.collection, modelCount: row.modelCount })) })
  })

  .get('/:id', validate('param', idParamSchema), async (c) => {
    const { db } = c.get('deps')
    const { id } = c.req.valid('param')
    const [collection] = await db.select().from(collections).where(eq(collections.id, id))
    if (!collection) throw notFound('Koleksiyon bulunamadı')
    const modelRows = await db
      .select()
      .from(models)
      .where(eq(models.collectionId, id))
      .orderBy(asc(models.sortOrder), asc(models.id))
    return c.json({ collection, models: modelRows })
  })

  .post('/', validate('json', collectionInputSchema), async (c) => {
    const [collection] = await c
      .get('deps')
      .db.insert(collections)
      .values(c.req.valid('json'))
      .returning()
    return c.json({ collection }, 201)
  })

  .patch(
    '/:id',
    validate('param', idParamSchema),
    validate('json', collectionUpdateSchema),
    async (c) => {
      const [collection] = await c
        .get('deps')
        .db.update(collections)
        .set(c.req.valid('json'))
        .where(eq(collections.id, c.req.valid('param').id))
        .returning()
      if (!collection) throw notFound('Koleksiyon bulunamadı')
      return c.json({ collection })
    },
  )

  /** Koleksiyonu ve tüm modellerini siler. */
  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const [deleted] = await c
      .get('deps')
      .db.delete(collections)
      .where(eq(collections.id, c.req.valid('param').id))
      .returning()
    if (!deleted) throw notFound('Koleksiyon bulunamadı')
    return c.body(null, 204)
  })

  .post('/reorder', validate('json', reorderSchema), async (c) => {
    await applyOrder(c.get('deps').db, collections, c.req.valid('json').ids)
    return c.json({ ok: true })
  })

// ── Modeller ────────────────────────────────────────────────────────────
export const modelsRoutes = new Hono<AppBindings>()
  .get(
    '/',
    validate('query', z.object({ collectionId: z.coerce.number().int().positive() })),
    async (c) => {
      const items = await c
        .get('deps')
        .db.select()
        .from(models)
        .where(eq(models.collectionId, c.req.valid('query').collectionId))
        .orderBy(asc(models.sortOrder), asc(models.id))
      return c.json({ items })
    },
  )

  .post('/', validate('json', modelInputSchema), async (c) => {
    const { db } = c.get('deps')
    const input = c.req.valid('json')
    const [collection] = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.id, input.collectionId))
    if (!collection) throw notFound('Koleksiyon bulunamadı')
    await assertColorExists(db, input.colorKey)

    const [model] = await db
      .insert(models)
      .values({ ...input, slug: input.slug ?? slugify(`${input.code}-${input.colorKey}`) })
      .returning()
    return c.json({ model }, 201)
  })

  .patch(
    '/:id',
    validate('param', idParamSchema),
    validate('json', modelUpdateSchema),
    async (c) => {
      const { db } = c.get('deps')
      const input = c.req.valid('json')
      if (input.colorKey) await assertColorExists(db, input.colorKey)

      const [model] = await db
        .update(models)
        .set(input)
        .where(eq(models.id, c.req.valid('param').id))
        .returning()
      if (!model) throw notFound('Model bulunamadı')
      return c.json({ model })
    },
  )

  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const [deleted] = await c
      .get('deps')
      .db.delete(models)
      .where(eq(models.id, c.req.valid('param').id))
      .returning()
    if (!deleted) throw notFound('Model bulunamadı')
    return c.body(null, 204)
  })

  .post('/reorder', validate('json', reorderSchema), async (c) => {
    await applyOrder(c.get('deps').db, models, c.req.valid('json').ids)
    return c.json({ ok: true })
  })
