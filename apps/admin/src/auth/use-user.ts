import type { PublicUser } from '@karar-hali/shared'
import { useRouteLoaderData } from 'react-router'

/** Korumalı layout'un loader'ındaki kullanıcı (route id: "admin"). */
export function useUser(): PublicUser {
  const data = useRouteLoaderData('admin') as { user: PublicUser } | undefined
  if (!data) throw new Error("useUser, yönetim layout'u içinde kullanılmalı")
  return data.user
}
