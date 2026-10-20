import { useMatches } from 'react-router'
import { locales, type Locale } from './config'
import { localePath, type RouteHandle } from './routes'

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'page' in handle
}

/** Geçerli sayfanın tüm dillerdeki adresleri (dil seçici ve hreflang için). */
export function useAlternatePaths(): Record<Locale, string> {
  const match = useMatches().findLast((m) => isRouteHandle(m.handle))
  const page = match && isRouteHandle(match.handle) ? match.handle.page : 'home'
  const slug = match?.params.slug

  return Object.fromEntries(
    locales.map((locale) => [locale, localePath(locale, page, { slug })]),
  ) as Record<Locale, string>
}
