import type { MediaItem, Paginated } from '@karar-hali/shared'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { dashboardKey } from '../dashboard/api'

export const mediaKeys = {
  all: ['media'] as const,
  page: (page: number, pageSize: number) => ['media', page, pageSize] as const,
}

export function useMediaPage(page: number, pageSize = 24) {
  return useQuery({
    queryKey: mediaKeys.page(page, pageSize),
    queryFn: () => http<Paginated<MediaItem>>(`/admin/media?page=${page}&pageSize=${pageSize}`),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateMedia() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    void queryClient.invalidateQueries({ queryKey: dashboardKey })
  }
}

export function useUploadMedia() {
  const invalidate = useInvalidateMedia()
  return useMutation({
    mutationFn: ({ file, alt = '' }: { file: File; alt?: string }) => {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', alt)
      return http<{ media: MediaItem }>('/admin/media', { method: 'POST', form })
    },
    onSuccess: invalidate,
  })
}

export function useUpdateMedia() {
  const invalidate = useInvalidateMedia()
  return useMutation({
    mutationFn: ({ id, alt }: { id: number; alt: string }) =>
      http(`/admin/media/${id}`, { method: 'PATCH', json: { alt } }),
    onSuccess: invalidate,
  })
}

export function useDeleteMedia() {
  const invalidate = useInvalidateMedia()
  return useMutation({
    mutationFn: (id: number) => http(`/admin/media/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}
