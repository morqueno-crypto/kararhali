import { collections } from '@/data/collections'
import type { Collection } from '@/types/collection'

// Şimdilik statik veri döner. Backend gelince: return http<Collection[]>('/api/collections')
export async function getCollections(): Promise<Collection[]> {
  return collections
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  return collections.filter((collection) => collection.featured)
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  return collections.find((collection) => collection.slug === slug)
}
