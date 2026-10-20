import type { Locale } from '@/i18n'
import { getFeaturedCollections } from '@/services/collections'
import { getCompanyOverview, getProductionOverview } from '@/services/company'

export async function homeLoader(locale: Locale) {
  const [featured, company, production] = await Promise.all([
    getFeaturedCollections(locale),
    getCompanyOverview(locale),
    getProductionOverview(locale),
  ])
  return { featured, company, production }
}
