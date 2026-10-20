import { getCollections } from '@/services/collections'

export async function collectionsLoader() {
  return { collections: await getCollections() }
}
