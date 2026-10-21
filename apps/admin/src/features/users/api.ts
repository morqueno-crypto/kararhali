import type { PublicUser, Role } from '@karar-hali/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { dashboardKey } from '../dashboard/api'

export const userKeys = { all: ['users'] as const }

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => (await http<{ items: PublicUser[] }>('/admin/users')).items,
  })
}

function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: userKeys.all })
    void queryClient.invalidateQueries({ queryKey: dashboardKey })
  }
}

export interface CreateUserInput {
  email: string
  name: string
  password: string
  role: Exclude<Role, 'owner'>
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      http<{ user: PublicUser }>('/admin/users', { method: 'POST', json: input }),
    onSuccess: invalidate,
  })
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: number
      name?: string
      role?: Exclude<Role, 'owner'>
      active?: boolean
      password?: string
    }) => http<{ user: PublicUser }>(`/admin/users/${id}`, { method: 'PATCH', json: input }),
    onSuccess: invalidate,
  })
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (id: number) => http(`/admin/users/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      http('/auth/change-password', { method: 'POST', json: input }),
  })
}
