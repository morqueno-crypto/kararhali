import { getFeaturedCollections } from '@/services/collections'
import { getCompanyOverview, getProductionOverview } from '@/services/company'

export async function homeLoader() {
  const [featured, company, production] = await Promise.all([
    getFeaturedCollections(),
    getCompanyOverview(),
    getProductionOverview(),
  ])
  return { featured, company, production }
}
