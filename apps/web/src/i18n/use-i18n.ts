import { use, useMemo } from 'react'
import { LocaleContext } from './context'
import { messages } from './messages'
import { localePath, type PageKey, type RouteParams } from './routes'

export function useI18n() {
  const locale = use(LocaleContext)
  if (!locale) throw new Error('useI18n, LocaleContext içinde kullanılmalı')

  return useMemo(
    () => ({
      locale,
      t: messages[locale],
      path: (page: PageKey, params?: RouteParams) => localePath(locale, page, params),
    }),
    [locale],
  )
}
