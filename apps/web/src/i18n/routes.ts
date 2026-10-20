import type { Locale } from './config'

/** Sayfaların dile göre URL parçaları. Yeni sayfa eklerken buraya da ekle. */
export const pageSegments = {
  home: { tr: '', en: '' },
  about: { tr: 'kurumsal', en: 'about' },
  collections: { tr: 'koleksiyonlar', en: 'collections' },
  production: { tr: 'uretim', en: 'production' },
  contact: { tr: 'iletisim', en: 'contact' },
} satisfies Record<string, Record<Locale, string>>

export type PageKey = keyof typeof pageSegments | 'collectionDetail'

/** Route `handle` alanı: dil değiştirirken aynı sayfanın karşılığını bulmak için. */
export interface RouteHandle {
  page: PageKey
}

export function localePath(locale: Locale, page: PageKey, params: { slug?: string } = {}) {
  if (page === 'collectionDetail') {
    return `/${locale}/${pageSegments.collections[locale]}/${params.slug ?? ''}`
  }
  const segment = pageSegments[page][locale]
  return segment ? `/${locale}/${segment}` : `/${locale}`
}
