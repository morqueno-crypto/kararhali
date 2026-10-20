import {
  collectionCategorySchema,
  contactInputSchema,
  localeSchema,
  slugSchema,
} from '@karar-hali/shared'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppBindings } from '../context'
import { contactMessages } from '../db/schema'
import { notFound } from '../lib/errors'
import { getClientIp } from '../lib/request'
import { validate } from '../lib/validate'
import {
  getPublicCollection,
  getPublicModelDetail,
  listPublicCollections,
} from '../services/catalog'
import { getPublicContent } from '../services/content'
import { getPublicSettings } from '../services/settings'

const localeQuery = z.object({ locale: localeSchema.default('tr') })
const PUBLIC_CACHE = 'public, max-age=60'

/** Herkese açık uçlar: sitenin okuduğu içerik ve iletişim formu. */
export const publicRoutes = new Hono<AppBindings>()
  .get('/health', (c) => c.json({ status: 'ok' }))

  /** Site geneli: ayarlar (iletişim, sosyal, logo...) + tüm içerik blokları, tek dilde. */
  .get('/site', validate('query', localeQuery), async (c) => {
    const { locale } = c.req.valid('query')
    const { db } = c.get('deps')
    const [settings, content] = await Promise.all([
      getPublicSettings(db, locale),
      getPublicContent(db, locale),
    ])
    c.header('Cache-Control', PUBLIC_CACHE)
    return c.json({ locale, settings, content })
  })

  .get(
    '/collections',
    validate(
      'query',
      localeQuery.extend({
        category: collectionCategorySchema.optional(),
        featured: z
          .enum(['true', 'false'])
          .transform((value) => value === 'true')
          .optional(),
      }),
    ),
    async (c) => {
      const { locale, category, featured } = c.req.valid('query')
      const items = await listPublicCollections(c.get('deps').db, locale, { category, featured })
      c.header('Cache-Control', PUBLIC_CACHE)
      return c.json({ items })
    },
  )

  .get(
    '/collections/:slug',
    validate('param', z.object({ slug: slugSchema })),
    validate('query', localeQuery),
    async (c) => {
      const { slug } = c.req.valid('param')
      const { locale } = c.req.valid('query')
      const collection = await getPublicCollection(c.get('deps').db, slug, locale)
      if (!collection) throw notFound('Koleksiyon bulunamadı')
      c.header('Cache-Control', PUBLIC_CACHE)
      return c.json(collection)
    },
  )

  .get(
    '/collections/:slug/models/:model',
    validate('param', z.object({ slug: slugSchema, model: slugSchema })),
    validate('query', localeQuery),
    async (c) => {
      const { slug, model } = c.req.valid('param')
      const { locale } = c.req.valid('query')
      const detail = await getPublicModelDetail(c.get('deps').db, slug, model, locale)
      if (!detail) throw notFound('Model bulunamadı')
      c.header('Cache-Control', PUBLIC_CACHE)
      return c.json(detail)
    },
  )

  /** İletişim formu: IP başına hız sınırlı; bot tuzağı (website) doluysa sessizce yok sayılır. */
  .post('/contact', validate('json', contactInputSchema), async (c) => {
    const { db, env, rateLimits } = c.get('deps')
    const ip = getClientIp(c, env.TRUST_PROXY)
    rateLimits.contact.hit(ip)

    const input = c.req.valid('json')
    if (input.website) return c.json({ ok: true }, 201)

    await db.insert(contactMessages).values({
      name: input.name,
      email: input.email,
      company: input.company || null,
      subject: input.subject,
      message: input.message,
      locale: input.locale,
      ip,
    })
    return c.json({ ok: true }, 201)
  })
