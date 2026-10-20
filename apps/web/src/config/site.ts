import { env } from '@/config/env'

// Örnek (dummy) kurumsal bilgiler.
export const siteConfig = {
  name: env.VITE_APP_NAME,
  tagline: 'Modern halı üretiminde ustalık',
  description:
    'Lumen Halı; tasarımdan dokumaya, kalite kontrolden ihracata kadar tüm süreçleri kendi tesislerinde yöneten modern bir halı üreticisidir.',
  contact: {
    address: 'Organize Sanayi Bölgesi, 4. Cadde No: 12, Şehitkamil / Gaziantep',
    phone: '+90 (342) 000 00 00',
    email: 'info@lumenhali.example',
    hours: 'Pazartesi – Cuma, 08:30 – 18:00',
  },
  nav: [
    { label: 'Kurumsal', to: '/kurumsal' },
    { label: 'Koleksiyonlar', to: '/koleksiyonlar' },
    { label: 'Üretim', to: '/uretim' },
    { label: 'İletişim', to: '/iletisim' },
  ],
} as const
