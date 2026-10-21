import type { PublicUser } from '@karar-hali/shared'
import { redirect } from 'react-router'
import { http, HttpError } from '@/lib/http'

/** Oturumdaki kullanıcı; oturum yoksa null. */
export async function fetchCurrentUser(): Promise<PublicUser | null> {
  try {
    const { user } = await http<{ user: PublicUser }>('/auth/me')
    return user
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) return null
    throw error
  }
}

/** Korumalı layout'un loader'ı: oturum yoksa girişe yönlendirir (dönüş adresiyle). */
export async function requireUserLoader({ request }: { request: Request }) {
  const user = await fetchCurrentUser()
  if (!user) {
    const { pathname, search } = new URL(request.url)
    const next = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname + search)}`
    throw redirect(`/login${next}`)
  }
  return { user }
}

/** Giriş sayfasının loader'ı: zaten oturum varsa panele gönderir. */
export async function guestOnlyLoader() {
  const user = await fetchCurrentUser().catch(() => null)
  if (user) throw redirect('/')
  return null
}

export async function logout() {
  await http('/auth/logout', { method: 'POST' })
}
