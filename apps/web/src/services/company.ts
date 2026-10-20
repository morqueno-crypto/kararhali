import { companyContent } from '@/data/company'
import type { Locale } from '@/i18n'

// Şimdilik statik veri döner. Backend/CMS gelince bu fonksiyonların içi değişir.
export async function getCompanyOverview(locale: Locale) {
  const { stats, values, milestones } = companyContent[locale]
  return { stats, values, milestones }
}

export async function getProductionOverview(locale: Locale) {
  const { productionSteps, facilityHighlights, certifications } = companyContent[locale]
  return { steps: productionSteps, highlights: facilityHighlights, certifications }
}
