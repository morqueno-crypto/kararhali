import { env } from '@/config/env'
import type { PageKey } from '@/i18n'

// Dilden bağımsız site sabitleri (örnek/dummy). Metinler i18n/messages altında.
export const siteConfig = {
  name: env.VITE_APP_NAME,
  contact: {
    phone: '+90 (342) 000 00 00',
    email: 'info@kararhali.example',
  },
  nav: ['about', 'collections', 'production', 'contact'] as const satisfies readonly PageKey[],
}
