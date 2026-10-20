import { collections } from '@/data/collections'
import type { Locale } from '@/i18n'
import type { Collection, CollectionRecord } from '@/types/collection'

function localize(record: CollectionRecord, locale: Locale): Collection {
  return {
    ...record,
    name: record.name[locale],
    summary: record.summary[locale],
    description: record.description[locale],
    material: record.material[locale],
    pileHeight: record.pileHeight[locale],
    technique: record.technique[locale],
    features: record.features[locale],
  }
}

// Şimdilik statik veri döner. Backend gelince: return http<Collection[]>(`/api/${locale}/collections`)
export async function getCollections(locale: Locale): Promise<Collection[]> {
  return collections.map((record) => localize(record, locale))
}

export async function getFeaturedCollections(locale: Locale): Promise<Collection[]> {
  return (await getCollections(locale)).filter((collection) => collection.featured)
}

export async function getCollectionBySlug(
  slug: string,
  locale: Locale,
): Promise<Collection | undefined> {
  const record = collections.find((collection) => collection.slug === slug)
  return record && localize(record, locale)
}
