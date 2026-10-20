import { pathToFileURL } from 'node:url'
import {
  contentBlockSchemas,
  passwordSchema,
  settingSchemas,
  type ContentKey,
  type SettingKey,
} from '@karar-hali/shared'
import { count } from 'drizzle-orm'
import { loadEnv } from '../env'
import { hashPassword } from '../lib/password'
import { slugify } from '../lib/slug'
import { configureSqlite, createDatabase, type Database } from './client'
import { runMigrations } from './migrate'
import { collections, colors, contentBlocks, models, settings, users } from './schema'
import { collections as seedCollections } from './seed-data/collections'
import { colors as seedColors } from './seed-data/colors'
import { contentSeed, settingsSeed } from './seed-data/content'

const IMG = 'https://www.kararhali.com/assets/img'

/** "6054A_A.GRI" → { code: "6054A", colorKey: "AGRI", slug: "6054a-a-gri" } (sitedeki adreslerle aynı) */
function parseModelFile(file: string) {
  const [code = file, ...rest] = file.trim().split(/[_-]/)
  return {
    code,
    colorKey: rest.join('').replace(/[.\s]/g, '').toUpperCase(),
    slug: slugify(file),
  }
}

/**
 * Başlangıç verisi. Güvenle tekrar çalıştırılabilir: yalnızca EKSİK olanları ekler,
 * panelden yapılmış değişikliklerin üzerine yazmaz.
 */
export async function seedDatabase(
  db: Database,
  owner?: { email: string; name: string; password: string },
) {
  const log: string[] = []
  const isEmpty = async (table: typeof users | typeof colors | typeof collections) =>
    ((await db.select({ value: count() }).from(table))[0]?.value ?? 0) === 0

  // Ana kullanıcı (owner): yalnızca hiç kullanıcı yoksa
  if (await isEmpty(users)) {
    if (owner?.email && owner.password) {
      passwordSchema.parse(owner.password)
      await db.insert(users).values({
        email: owner.email.trim().toLowerCase(),
        name: owner.name || 'Yönetici',
        role: 'owner',
        passwordHash: await hashPassword(owner.password),
      })
      log.push(`Ana kullanıcı oluşturuldu: ${owner.email}`)
    } else {
      log.push(
        'UYARI: Kullanıcı yok ve OWNER_EMAIL / OWNER_PASSWORD tanımlı değil; owner oluşturulmadı.',
      )
    }
  }

  if (await isEmpty(colors)) {
    await db
      .insert(colors)
      .values(Object.entries(seedColors).map(([key, value]) => ({ key, ...value })))
    log.push(`${Object.keys(seedColors).length} renk eklendi`)
  }

  if (await isEmpty(collections)) {
    let modelCount = 0
    for (const [index, item] of seedCollections.entries()) {
      const [collection] = await db
        .insert(collections)
        .values({
          slug: item.slug,
          name: item.name,
          category: item.category,
          sizes: [...item.sizes],
          coverImage: item.cover ? `${IMG}/${item.cover}` : null,
          description: item.description,
          featured: item.featured ?? false,
          sortOrder: index,
        })
        .returning({ id: collections.id })

      const rows = item.models.map((file, order) => ({
        ...parseModelFile(file),
        collectionId: collection!.id,
        image: `${IMG}/${item.slug}/${encodeURI(file)}.jpg`,
        sortOrder: order,
      }))
      if (rows.length) await db.insert(models).values(rows)
      modelCount += rows.length
    }
    log.push(`${seedCollections.length} koleksiyon ve ${modelCount} model eklendi`)
  }

  // İçerik blokları ve ayarlar: kaydı olmayan anahtarlar eklenir (şemayla doğrulanarak).
  const existingContent = new Set(
    (await db.select({ key: contentBlocks.key }).from(contentBlocks)).map((r) => r.key),
  )
  for (const key of Object.keys(contentSeed) as ContentKey[]) {
    if (existingContent.has(key)) continue
    await db
      .insert(contentBlocks)
      .values({ key, data: contentBlockSchemas[key].parse(contentSeed[key]) })
    log.push(`İçerik eklendi: ${key}`)
  }

  const existingSettings = new Set(
    (await db.select({ key: settings.key }).from(settings)).map((r) => r.key),
  )
  for (const key of Object.keys(settingsSeed) as SettingKey[]) {
    if (existingSettings.has(key)) continue
    await db.insert(settings).values({ key, value: settingSchemas[key].parse(settingsSeed[key]) })
    log.push(`Ayar eklendi: ${key}`)
  }

  return log
}

// Doğrudan çalıştırıldığında: pnpm db:seed
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = loadEnv()
  const db = createDatabase(env.DATABASE_URL)
  await configureSqlite(db)
  await runMigrations(db)
  const log = await seedDatabase(db, {
    email: env.OWNER_EMAIL,
    name: env.OWNER_NAME,
    password: env.OWNER_PASSWORD,
  })
  console.log(log.length ? log.join('\n') : 'Eklenecek yeni veri yok.')
}
