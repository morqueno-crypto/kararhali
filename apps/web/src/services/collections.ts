import { collections } from '@/data/collections'
import { colors } from '@/data/colors'
import type { Locale } from '@/i18n'
import { assetUrl } from '@/lib/assets'
import type { Collection, CollectionRecord, ProductModel } from '@/types/collection'

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** "6054A_A.GRI" → kod "6054A", renk "A.GRI" */
function toModel(file: string, collectionSlug: string, locale: Locale): ProductModel {
  const [code = file, ...rest] = file.trim().split(/[_-]/)
  const colorKey = rest.join('').replace(/[.\s]/g, '').toUpperCase()
  const color = colors[colorKey]

  return {
    slug: slugify(file),
    collectionSlug,
    code,
    colorKey,
    color: color?.name[locale] ?? colorKey,
    hex: color?.hex ?? '#888888',
    image: assetUrl(`${collectionSlug}/${file}.jpg`),
  }
}

function localize(record: CollectionRecord, locale: Locale): Collection {
  const models = record.models.map((file) => toModel(file, record.slug, locale))
  return {
    slug: record.slug,
    name: record.name,
    category: record.category,
    sizes: record.sizes,
    cover: record.cover ? assetUrl(record.cover) : (models[0]?.image ?? ''),
    description: record.description[locale],
    featured: record.featured ?? false,
    models,
  }
}

// Şimdilik statik veri döner. Backend gelince: return http<Collection[]>(`/api/${locale}/collections`)
export async function getCollections(locale: Locale): Promise<Collection[]> {
  return collections.map((record) => localize(record, locale))
}

export async function getFeaturedCollections(locale: Locale): Promise<Collection[]> {
  return (await getCollections(locale)).filter((collection) => collection.featured)
}

export async function getCollectionBySlug(slug: string, locale: Locale) {
  const record = collections.find((collection) => collection.slug === slug)
  return record && localize(record, locale)
}

export async function getModelDetail(collectionSlug: string, modelSlug: string, locale: Locale) {
  const collection = await getCollectionBySlug(collectionSlug, locale)
  const model = collection?.models.find((m) => m.slug === modelSlug)
  if (!collection || !model) return undefined

  /** Aynı desenin diğer renkleri */
  const variants = collection.models.filter((m) => m.code === model.code)
  /** Koleksiyondaki diğer desenler */
  const related = collection.models.filter((m) => m.code !== model.code).slice(0, 4)

  return { collection, model, variants, related }
}
