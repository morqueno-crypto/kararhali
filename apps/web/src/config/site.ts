import { env } from '@/config/env'
import type { PageKey } from '@/i18n'
import { assetUrl } from '@/lib/assets'

// Dilden bağımsız site sabitleri (kararhali.com'dan). Metinler i18n/messages altında.
export const siteConfig = {
  name: env.VITE_APP_NAME,
  logo: assetUrl('logo.png'),
  contact: {
    phone: '+90 342 337 90 31',
    phoneLines: '+90 342 337 90 31-32-33',
    fax: '+90 342 337 90 34',
    email: 'karar@kararhali.com',
  },
  social: {
    instagram: 'https://www.instagram.com/kararcarpet/',
    facebook: 'https://www.facebook.com/people/Karar-Halı/100003271087939/',
  },
  dealerLogin: 'https://tahsilat.kararhali.com/',
  nav: ['about', 'collections', 'production', 'contact'] as const satisfies readonly PageKey[],
}
