import type { CollectionCategory, DashboardData } from '@karar-hali/shared'
import { count, desc, eq, gte, isNotNull } from 'drizzle-orm'
import { Hono } from 'hono'
import type { AppBindings } from '../../context'
import { collections, contactMessages, contentBlocks, media, models, users } from '../../db/schema'
import { requireAuth } from '../../middleware/auth'
import { collectionsRoutes, colorsRoutes, modelsRoutes } from './catalog'
import { contentRoutes, settingsRoutes } from './content'
import { mediaRoutes } from './media'
import { messagesRoutes } from './messages'
import { usersRoutes } from './users'

const DAY_MS = 24 * 60 * 60 * 1000

/** Son `days` günün tarih anahtarları (YYYY-MM-DD, UTC), eskiden yeniye. */
function lastDays(days: number) {
  const today = new Date()
  return Array.from({ length: days }, (_, index) =>
    new Date(today.getTime() - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10),
  )
}

/**
 * Yönetim uçları — hepsi oturum ister.
 * Yetkiler: editor → katalog, içerik, medya · admin → + ayarlar, mesajlar · owner → + kullanıcılar
 */
export const adminRoutes = new Hono<AppBindings>()
  .use('*', requireAuth)

  /** Panel ana sayfası: özet sayılar, son 14 gün mesaj grafiği, son mesajlar ve içerik güncellemeleri */
  .get('/dashboard', async (c) => {
    const { db } = c.get('deps')
    const total = async (query: Promise<{ value: number }[]>) => (await query)[0]?.value ?? 0
    const days = lastDays(14)
    const canSeeMessages = c.get('user').role !== 'editor'

    const [
      collectionCount,
      modelCount,
      mediaCount,
      newMessages,
      userCount,
      byCategory,
      messageDates,
      recentMessages,
      recentContent,
    ] = await Promise.all([
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
      db
        .select({ category: collections.category, value: count() })
        .from(collections)
        .groupBy(collections.category),
      db
        .select({ createdAt: contactMessages.createdAt })
        .from(contactMessages)
        .where(gte(contactMessages.createdAt, days[0]!)),
      canSeeMessages
        ? db.select().from(contactMessages).orderBy(desc(contactMessages.id)).limit(5)
        : Promise.resolve([]),
      db
        .select({ key: contentBlocks.key, updatedAt: contentBlocks.updatedAt })
        .from(contentBlocks)
        .where(isNotNull(contentBlocks.updatedBy))
        .orderBy(desc(contentBlocks.updatedAt))
        .limit(5),
    ])

    const perDay = new Map(days.map((date) => [date, 0]))
    for (const { createdAt } of messageDates) {
      const date = createdAt.slice(0, 10)
      if (perDay.has(date)) perDay.set(date, perDay.get(date)! + 1)
    }

    const collectionsByCategory: Record<CollectionCategory, number> = { carpet: 0, roll: 0 }
    for (const row of byCategory) collectionsByCategory[row.category] = row.value

    const data: DashboardData = {
      collectionCount,
      modelCount,
      mediaCount,
      newMessages: canSeeMessages ? newMessages : 0,
      userCount,
      collectionsByCategory,
      messagesByDay: days.map((date) => ({ date, count: perDay.get(date) ?? 0 })),
      recentMessages,
      recentContent: recentContent as DashboardData['recentContent'],
    }
    return c.json(data)
  })

  .route('/users', usersRoutes)
  .route('/colors', colorsRoutes)
  .route('/collections', collectionsRoutes)
  .route('/models', modelsRoutes)
  .route('/content', contentRoutes)
  .route('/settings', settingsRoutes)
  .route('/media', mediaRoutes)
  .route('/messages', messagesRoutes)
