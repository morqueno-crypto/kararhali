import type { Localized } from '@/i18n'

interface ColorInfo {
  name: Localized
  hex: string
}

/** Dosya adlarındaki renk kodları (nokta ve boşluk temizlenmiş hâli). */
export const colors: Record<string, ColorInfo> = {
  KAHVE: { name: { tr: 'Kahve', en: 'Brown' }, hex: '#7a5a43' },
  AKAHVE: { name: { tr: 'Açık Kahve', en: 'Light Brown' }, hex: '#a3826a' },
  OKAHVE: { name: { tr: 'Orta Kahve', en: 'Mid Brown' }, hex: '#8a6a52' },
  KKAHVE: { name: { tr: 'Koyu Kahve', en: 'Dark Brown' }, hex: '#523a2b' },
  GRI: { name: { tr: 'Gri', en: 'Grey' }, hex: '#9a9a98' },
  AGRI: { name: { tr: 'Açık Gri', en: 'Light Grey' }, hex: '#c4c4c1' },
  OGRI: { name: { tr: 'Orta Gri', en: 'Mid Grey' }, hex: '#8c8c8a' },
  KGRI: { name: { tr: 'Koyu Gri', en: 'Dark Grey' }, hex: '#5e5e5d' },
  ANTRASIT: { name: { tr: 'Antrasit', en: 'Anthracite' }, hex: '#3b3d40' },
  ANSTASIT: { name: { tr: 'Antrasit', en: 'Anthracite' }, hex: '#3b3d40' },
  SIYAH: { name: { tr: 'Siyah', en: 'Black' }, hex: '#1d1d1d' },
  BEYAZ: { name: { tr: 'Beyaz', en: 'White' }, hex: '#f1efe9' },
  KREM: { name: { tr: 'Krem', en: 'Cream' }, hex: '#e8dcc4' },
  BEJ: { name: { tr: 'Bej', en: 'Beige' }, hex: '#cdb894' },
  KBEJ: { name: { tr: 'Koyu Bej', en: 'Dark Beige' }, hex: '#a8936f' },
  SARI: { name: { tr: 'Sarı', en: 'Yellow' }, hex: '#d4a93c' },
  GOLD: { name: { tr: 'Gold', en: 'Gold' }, hex: '#b8954a' },
  TARCIN: { name: { tr: 'Tarçın', en: 'Cinnamon' }, hex: '#9c5b34' },
  ROSE: { name: { tr: 'Rose', en: 'Rose' }, hex: '#d7a7a4' },
  PEMBE: { name: { tr: 'Pembe', en: 'Pink' }, hex: '#e3a9b8' },
  BORDO: { name: { tr: 'Bordo', en: 'Burgundy' }, hex: '#6e1f2a' },
  MAVI: { name: { tr: 'Mavi', en: 'Blue' }, hex: '#5c7fa3' },
  LACIVERT: { name: { tr: 'Lacivert', en: 'Navy' }, hex: '#22314f' },
  YESIL: { name: { tr: 'Yeşil', en: 'Green' }, hex: '#5d7a5a' },
  HASIR: { name: { tr: 'Hasır', en: 'Straw' }, hex: '#c9b07c' },
  MULTI: { name: { tr: 'Çok Renkli', en: 'Multicolour' }, hex: '#b06a4f' },
  RENKLI: { name: { tr: 'Çok Renkli', en: 'Multicolour' }, hex: '#b06a4f' },
}
