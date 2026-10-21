import type { ContactMessage, MessageStatus, Paginated } from '@karar-hali/shared'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { dashboardKey } from '../dashboard/api'

export const messageKeys = {
  all: ['messages'] as const,
  list: (status: MessageStatus | 'all', page: number) => ['messages', status, page] as const,
}

export function useMessages(status: MessageStatus | 'all', page: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: '20' })
  if (status !== 'all') params.set('status', status)
  return useQuery({
    queryKey: messageKeys.list(status, page),
    queryFn: () => http<Paginated<ContactMessage>>(`/admin/messages?${params}`),
    placeholderData: keepPreviousData,
  })
}

function useInvalidateMessages() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: messageKeys.all })
    void queryClient.invalidateQueries({ queryKey: dashboardKey })
  }
}

export function useSetMessageStatus() {
  const invalidate = useInvalidateMessages()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: MessageStatus }) =>
      http<{ message: ContactMessage }>(`/admin/messages/${id}`, {
        method: 'PATCH',
        json: { status },
      }),
    onSuccess: invalidate,
  })
}

export function useDeleteMessage() {
  const invalidate = useInvalidateMessages()
  return useMutation({
    mutationFn: (id: number) => http(`/admin/messages/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}
