import { QueryClient } from '@tanstack/react-query'
import { HttpError } from './http'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Yetki / bulunamadı hatalarında tekrar denemenin anlamı yok.
        retry: (failureCount, error) =>
          !(error instanceof HttpError && [401, 403, 404].includes(error.status)) &&
          failureCount < 2,
      },
    },
  })
}
