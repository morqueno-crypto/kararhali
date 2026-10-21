import type {
  AdminCollection,
  AdminCollectionListItem,
  AdminColor,
  AdminModel,
  CollectionInput,
  ColorInput,
  ModelInput,
} from '@karar-hali/shared'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/http'
import { dashboardKey } from '../dashboard/api'

export const catalogKeys = {
  collections: ['collections'] as const,
  collection: (id: number) => ['collections', id] as const,
  colors: ['colors'] as const,
}

// ── Koleksiyonlar ───────────────────────────────────────────────────────
export function useCollections() {
  return useQuery({
    queryKey: catalogKeys.collections,
    queryFn: async () =>
      (await http<{ items: AdminCollectionListItem[] }>('/admin/collections')).items,
  })
}

export function useCollection(id: number | undefined) {
  return useQuery({
    queryKey: catalogKeys.collection(id ?? 0),
    queryFn: () =>
      http<{ collection: AdminCollection; models: AdminModel[] }>(`/admin/collections/${id}`),
    enabled: !!id,
  })
}

/** Katalogda değişiklik olunca listeler, detay ve panel özeti yenilenir. */
function useInvalidateCatalog() {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: catalogKeys.collections })
    void queryClient.invalidateQueries({ queryKey: dashboardKey })
  }
}

export function useSaveCollection(id?: number) {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: (input: Partial<CollectionInput>) =>
      id
        ? http<{ collection: AdminCollection }>(`/admin/collections/${id}`, {
            method: 'PATCH',
            json: input,
          })
        : http<{ collection: AdminCollection }>('/admin/collections', {
            method: 'POST',
            json: input,
          }),
    onSuccess: invalidate,
  })
}

/** Listede satır içi değişiklik (yayın / öne çıkan) */
export function usePatchCollection() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<CollectionInput> & { id: number }) =>
      http(`/admin/collections/${id}`, { method: 'PATCH', json: input }),
    onSuccess: invalidate,
  })
}

export function useDeleteCollection() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: (id: number) => http(`/admin/collections/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}

export function useReorderCollections() {
  const invalidate = useInvalidateCatalog()
  return useMutation({
    mutationFn: (ids: number[]) =>
      http('/admin/collections/reorder', { method: 'POST', json: { ids } }),
    onSettled: invalidate,
  })
}

// ── Modeller ────────────────────────────────────────────────────────────
function useInvalidateCollection(collectionId: number) {
  const queryClient = useQueryClient()
  const invalidateCatalog = useInvalidateCatalog()
  return () => {
    void queryClient.invalidateQueries({ queryKey: catalogKeys.collection(collectionId) })
    invalidateCatalog()
  }
}

export function useSaveModel(collectionId: number) {
  const invalidate = useInvalidateCollection(collectionId)
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<ModelInput> & { id?: number }) =>
      id
        ? http<{ model: AdminModel }>(`/admin/models/${id}`, { method: 'PATCH', json: input })
        : http<{ model: AdminModel }>('/admin/models', {
            method: 'POST',
            json: { ...input, collectionId },
          }),
    onSuccess: invalidate,
  })
}

export function useDeleteModel(collectionId: number) {
  const invalidate = useInvalidateCollection(collectionId)
  return useMutation({
    mutationFn: (id: number) => http(`/admin/models/${id}`, { method: 'DELETE' }),
    onSuccess: invalidate,
  })
}

export function useReorderModels(collectionId: number) {
  const invalidate = useInvalidateCollection(collectionId)
  return useMutation({
    mutationFn: (ids: number[]) => http('/admin/models/reorder', { method: 'POST', json: { ids } }),
    onSettled: invalidate,
  })
}

// ── Renkler ─────────────────────────────────────────────────────────────
export function useColors() {
  return useQuery({
    queryKey: catalogKeys.colors,
    queryFn: async () => (await http<{ items: AdminColor[] }>('/admin/colors')).items,
  })
}

export function useSaveColor(existingKey?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ColorInput) =>
      existingKey
        ? http(`/admin/colors/${existingKey}`, {
            method: 'PATCH',
            json: { name: input.name, hex: input.hex },
          })
        : http('/admin/colors', { method: 'POST', json: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: catalogKeys.colors }),
  })
}

export function useDeleteColor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (key: string) => http(`/admin/colors/${key}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: catalogKeys.colors }),
  })
}
