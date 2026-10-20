import { getCompanyOverview } from '@/services/company'

export async function aboutLoader() {
  return getCompanyOverview()
}
