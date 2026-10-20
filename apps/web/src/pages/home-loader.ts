import type { Locale } from '@/i18n'
import { getCollections } from '@/services/collections'

/** Sayfa metinleri site verisinden (useSite) gelir; burada yalnızca öne çıkan koleksiyonlar yüklenir. */
export async function homeLoader(locale: Locale) {
  return { featured: await getCollections(locale, { featured: true }) }
}
