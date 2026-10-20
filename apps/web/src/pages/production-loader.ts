import type { Locale } from '@/i18n'
import { getProductionOverview } from '@/services/company'

export async function productionLoader(locale: Locale) {
  return getProductionOverview(locale)
}
