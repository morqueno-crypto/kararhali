import type { Locale } from '@/i18n'
import { http, httpOptional } from '@/lib/http'
import type { Collection, CollectionCategory, ModelDetail } from '@/types/collection'

interface CollectionFilters {
  category?: CollectionCategory
  featured?: boolean
}

export async function getCollections(locale: Locale, filters: CollectionFilters = {}) {
  const params = new URLSearchParams({ locale })
  if (filters.category) params.set('category', filters.category)
  if (filters.featured !== undefined) params.set('featured', String(filters.featured))
  const { items } = await http<{ items: Collection[] }>(`/api/v1/collections?${params}`)
  return items
}

/** Bulunamazsa undefined. */
export function getCollectionBySlug(slug: string, locale: Locale) {
  return httpOptional<Collection>(
    `/api/v1/collections/${encodeURIComponent(slug)}?locale=${locale}`,
  )
}

/** Model + aynı desenin diğer renkleri + koleksiyondaki diğer desenler. Bulunamazsa undefined. */
export function getModelDetail(collectionSlug: string, modelSlug: string, locale: Locale) {
  return httpOptional<ModelDetail>(
    `/api/v1/collections/${encodeURIComponent(collectionSlug)}/models/${encodeURIComponent(modelSlug)}?locale=${locale}`,
  )
}
