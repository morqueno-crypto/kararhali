import { createContext } from 'react'
import type { SiteData } from '@/services/site'

/** API'den gelen site verisi (ayarlar + içerik). Dil route'unun loader'ı doldurur. */
export const SiteContext = createContext<SiteData | null>(null)
