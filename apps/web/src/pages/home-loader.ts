import type { Locale } from '@/i18n'
import { getFeaturedCollections } from '@/services/collections'
import { getCompanyOverview } from '@/services/company'

export async function homeLoader(locale: Locale) {
  const [featured, company] = await Promise.all([
    getFeaturedCollections(locale),
    getCompanyOverview(locale),
  ])
  return { featured, company }
}
