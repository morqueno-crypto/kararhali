import {
  certifications,
  companyMilestones,
  companyStats,
  companyValues,
  facilityHighlights,
  productionSteps,
} from '@/data/company'

// Şimdilik statik veri döner. Backend/CMS gelince bu fonksiyonların içi değişir.
export async function getCompanyOverview() {
  return { stats: companyStats, values: companyValues, milestones: companyMilestones }
}

export async function getProductionOverview() {
  return { steps: productionSteps, highlights: facilityHighlights, certifications }
}
