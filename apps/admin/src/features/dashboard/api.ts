import type { DashboardData } from '@karar-hali/shared'
import { useQuery } from '@tanstack/react-query'
import { http } from '@/lib/http'

export const dashboardKey = ['dashboard'] as const

/** Panel özeti. Menüdeki yeni mesaj rozeti de bunu kullanır (dakikada bir yenilenir). */
export function useDashboard() {
  return useQuery({
    queryKey: dashboardKey,
    queryFn: () => http<DashboardData>('/admin/dashboard'),
    refetchInterval: 60_000,
  })
}
