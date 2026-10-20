import type { PageKey } from '@/i18n'

// Kodda kalan site yapısı. Firma bilgileri, logo ve içerikler API'den gelir (bkz. src/site).
export const siteConfig = {
  nav: ['about', 'collections', 'production', 'contact'] as const satisfies readonly PageKey[],
}
