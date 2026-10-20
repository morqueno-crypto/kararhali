import type { Locale } from '@/i18n'
import { getCompanyOverview } from '@/services/company'

export async function aboutLoader(locale: Locale) {
  return getCompanyOverview(locale)
}
