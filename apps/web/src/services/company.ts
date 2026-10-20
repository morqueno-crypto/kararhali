import { companyContent, companyImages } from '@/data/company'
import type { Locale } from '@/i18n'
import { assetUrl } from '@/lib/assets'

const images = {
  hero: assetUrl(companyImages.hero),
  carpets: assetUrl(companyImages.carpets),
  rolls: assetUrl(companyImages.rolls),
  catalogs: assetUrl(companyImages.catalogs),
  craft: assetUrl(companyImages.craft),
  fairs: companyImages.fairs.map(assetUrl),
}

// Şimdilik statik veri döner. Backend/CMS gelince bu fonksiyonların içi değişir.
export async function getCompanyOverview(locale: Locale) {
  const { stats, pillars, values } = companyContent[locale]
  return { stats, pillars, values, images }
}

export async function getProductionOverview(locale: Locale) {
  return { steps: companyContent[locale].productionSteps, images }
}
