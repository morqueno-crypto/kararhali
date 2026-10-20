import { use, useMemo } from 'react'
import { LocaleContext } from './context'
import { messages } from './messages'
import { localePath, type PageKey } from './routes'

export function useI18n() {
  const locale = use(LocaleContext)
  if (!locale) throw new Error('useI18n, LocaleContext içinde kullanılmalı')

  return useMemo(
    () => ({
      locale,
      t: messages[locale],
      path: (page: PageKey, params?: { slug?: string }) => localePath(locale, page, params),
    }),
    [locale],
  )
}
