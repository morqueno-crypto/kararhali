import { getProductionOverview } from '@/services/company'

export async function productionLoader() {
  return getProductionOverview()
}
