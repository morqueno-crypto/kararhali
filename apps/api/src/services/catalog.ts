import type {
  CollectionCategory,
  Locale,
  PublicCollection,
  PublicModel,
  PublicModelDetail,
} from '@karar-hali/shared'
import { and, asc, eq, inArray } from 'drizzle-orm'
import type { Database } from '../db/client'
import { collections, colors, models } from '../db/schema'

type CollectionRow = typeof collections.$inferSelect
type ModelRow = typeof models.$inferSelect
type ColorRow = typeof colors.$inferSelect

function toPublicModel(
  row: ModelRow,
  collectionSlug: string,
  color: ColorRow | undefined,
  locale: Locale,
): PublicModel {
  return {
    slug: row.slug,
    collectionSlug,
    code: row.code,
    colorKey: row.colorKey,
    color: color?.name[locale] ?? row.colorKey,
    hex: color?.hex ?? '#888888',
    image: row.image,
  }
}

function toPublicCollection(
  row: CollectionRow,
  modelRows: ModelRow[],
  colorMap: Map<string, ColorRow>,
  locale: Locale,
): PublicCollection {
  const publicModels = modelRows.map((model) =>
    toPublicModel(model, row.slug, colorMap.get(model.colorKey), locale),
  )
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    sizes: row.sizes,
    // Kapak yoksa ilk modelin fotoğrafı kullanılır.
    cover: row.coverImage ?? publicModels[0]?.image ?? '',
    description: row.description[locale],
    featured: row.featured,
    models: publicModels,
  }
}

async function loadColorMap(db: Database) {
  const rows = await db.select().from(colors)
  return new Map(rows.map((row) => [row.key, row]))
}

/** Yayındaki koleksiyonlar ve yayındaki modelleri (sıralı). */
export async function listPublicCollections(
  db: Database,
  locale: Locale,
  filters: { category?: CollectionCategory; featured?: boolean } = {},
) {
  const conditions = [eq(collections.published, true)]
  if (filters.category) conditions.push(eq(collections.category, filters.category))
  if (filters.featured !== undefined) conditions.push(eq(collections.featured, filters.featured))

  const collectionRows = await db
    .select()
    .from(collections)
    .where(and(...conditions))
    .orderBy(asc(collections.sortOrder), asc(collections.id))
  if (collectionRows.length === 0) return []

  const modelRows = await db
    .select()
    .from(models)
    .where(
      and(
        eq(models.published, true),
        inArray(
          models.collectionId,
          collectionRows.map((row) => row.id),
        ),
      ),
    )
    .orderBy(asc(models.sortOrder), asc(models.id))
  const colorMap = await loadColorMap(db)

  return collectionRows.map((row) =>
    toPublicCollection(
      row,
      modelRows.filter((model) => model.collectionId === row.id),
      colorMap,
      locale,
    ),
  )
}

export async function getPublicCollection(db: Database, slug: string, locale: Locale) {
  const [row] = await db
    .select()
    .from(collections)
    .where(and(eq(collections.slug, slug), eq(collections.published, true)))
    .limit(1)
  if (!row) return undefined

  const modelRows = await db
    .select()
    .from(models)
    .where(and(eq(models.collectionId, row.id), eq(models.published, true)))
    .orderBy(asc(models.sortOrder), asc(models.id))
  return toPublicCollection(row, modelRows, await loadColorMap(db), locale)
}

export async function getPublicModelDetail(
  db: Database,
  collectionSlug: string,
  modelSlug: string,
  locale: Locale,
): Promise<PublicModelDetail | undefined> {
  const collection = await getPublicCollection(db, collectionSlug, locale)
  const model = collection?.models.find((item) => item.slug === modelSlug)
  if (!collection || !model) return undefined

  return {
    collection,
    model,
    variants: collection.models.filter((item) => item.code === model.code),
    related: collection.models.filter((item) => item.code !== model.code).slice(0, 4),
  }
}
