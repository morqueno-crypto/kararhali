import type { ContentKey, PublicContent } from '@karar-hali/shared'
import { use } from 'react'
import { SiteContext } from './context'

export function useSite() {
  const site = use(SiteContext)
  if (!site) throw new Error('useSite, SiteContext içinde kullanılmalı')
  return site
}

/** Tek bir içerik bloğu (geçerli dilde). */
export function useContent<K extends ContentKey>(key: K): PublicContent[K] {
  return useSite().content[key]
}
