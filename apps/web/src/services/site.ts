import {
  contentKeys,
  type PublicContent,
  type PublicSiteSettings,
  type SiteResponse,
} from '@karar-hali/shared'
import type { Locale } from '@/i18n'
import { http } from '@/lib/http'

export interface SiteSettings {
  general: NonNullable<PublicSiteSettings['general']>
  contact: NonNullable<PublicSiteSettings['contact']>
  social: NonNullable<PublicSiteSettings['social']>
}

export interface SiteData {
  settings: SiteSettings
  content: PublicContent
}

const emptySocial = { instagram: '', facebook: '', linkedin: '', youtube: '' }

/**
 * Site geneli veriler: ayarlar (logo, iletişim, sosyal...) ve tüm sayfa içerikleri, tek istekte.
 * Zorunlu bir ayar veya içerik bloğu eksikse (seed çalıştırılmamışsa) açık bir hata verir;
 * böylece bileşenler eksik veri kontrolüyle uğraşmaz.
 */
export async function getSite(locale: Locale): Promise<SiteData> {
  const site = await http<SiteResponse>(`/api/v1/site?locale=${locale}`)
  const { general, contact, social } = site.settings
  const missing = [
    ...contentKeys.filter((key) => !site.content[key]),
    ...(general ? [] : ['settings.general']),
    ...(contact ? [] : ['settings.contact']),
  ]
  if (missing.length > 0 || !general || !contact) {
    throw new Error(`Eksik site verisi: ${missing.join(', ')} (API'de db:seed çalıştırın)`)
  }
  return {
    settings: { general, contact, social: social ?? emptySocial },
    content: site.content as PublicContent,
  }
}
