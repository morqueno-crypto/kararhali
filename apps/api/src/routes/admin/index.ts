import { count, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { AppBindings } from '../../context'
import { collections, contactMessages, media, models, users } from '../../db/schema'
import { requireAuth } from '../../middleware/auth'
import { collectionsRoutes, colorsRoutes, modelsRoutes } from './catalog'
import { contentRoutes, settingsRoutes } from './content'
import { mediaRoutes } from './media'
import { messagesRoutes } from './messages'
import { usersRoutes } from './users'

/**
 * Yönetim uçları — hepsi oturum ister.
 * Yetkiler: editor → katalog, içerik, medya · admin → + ayarlar, mesajlar · owner → + kullanıcılar
 */
export const adminRoutes = new Hono<AppBindings>()
  .use('*', requireAuth)

  /** Panel ana sayfası için özet sayılar */
  .get('/dashboard', async (c) => {
    const { db } = c.get('deps')
    const total = async (query: Promise<{ value: number }[]>) => (await query)[0]?.value ?? 0
    const [collectionCount, modelCount, mediaCount, newMessages, userCount] = await Promise.all([
      total(db.select({ value: count() }).from(collections)),
      total(db.select({ value: count() }).from(models)),
      total(db.select({ value: count() }).from(media)),
      total(
        db
          .select({ value: count() })
          .from(contactMessages)
          .where(eq(contactMessages.status, 'new')),
      ),
      total(db.select({ value: count() }).from(users)),
    ])
    return c.json({ collectionCount, modelCount, mediaCount, newMessages, userCount })
  })

  .route('/users', usersRoutes)
  .route('/colors', colorsRoutes)
  .route('/collections', collectionsRoutes)
  .route('/models', modelsRoutes)
  .route('/content', contentRoutes)
  .route('/settings', settingsRoutes)
  .route('/media', mediaRoutes)
  .route('/messages', messagesRoutes)
