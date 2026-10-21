import type { AdminContentItem, AdminSettingItem, ContentKey, SettingKey } from '@karar-hali/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { dashboardKey } from '../dashboard/api'

export const contentKeysQuery = {
  list: ['content'] as const,
  block: (key: ContentKey) => ['content', key] as const,
  settings: ['settings'] as const,
}

export function useContentList() {
  return useQuery({
    queryKey: contentKeysQuery.list,
    queryFn: async () => (await http<{ items: AdminContentItem[] }>('/admin/content')).items,
  })
}

export function useContentBlock(key: ContentKey) {
  return useQuery({
    queryKey: contentKeysQuery.block(key),
    queryFn: () => http<AdminContentItem>(`/admin/content/${key}`),
  })
}

export function useSaveContent(key: ContentKey) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: unknown) =>
      http<AdminContentItem>(`/admin/content/${key}`, { method: 'PUT', json: data }),
    onSuccess: (saved) => {
      queryClient.setQueryData(contentKeysQuery.block(key), saved)
      void queryClient.invalidateQueries({ queryKey: contentKeysQuery.list })
      void queryClient.invalidateQueries({ queryKey: dashboardKey })
    },
  })
}

export function useSettings() {
  return useQuery({
    queryKey: contentKeysQuery.settings,
    queryFn: async () => (await http<{ items: AdminSettingItem[] }>('/admin/settings')).items,
  })
}

export function useSaveSetting(key: SettingKey) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: unknown) => http(`/admin/settings/${key}`, { method: 'PUT', json: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentKeysQuery.settings }),
  })
}
