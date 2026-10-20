import type { Locale } from '@/i18n'
import { getCollections } from '@/services/collections'

export async function collectionsLoader(locale: Locale) {
  return { collections: await getCollections(locale) }
}
