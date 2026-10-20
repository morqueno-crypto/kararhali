import {
  settingSchemas,
  type Locale,
  type PublicSiteSettings,
  type SettingKey,
  type Settings,
} from '@karar-hali/shared'
import { z } from 'zod'
import type { Database } from '../db/client'
import { settings } from '../db/schema'
import { badRequest } from '../lib/errors'

export function parseSetting<K extends SettingKey>(key: K, value: unknown): Settings[K] {
  const schema: z.ZodType = settingSchemas[key]
  const result = schema.safeParse(value)
  if (!result.success) throw badRequest('Ayar verisi geçersiz', z.flattenError(result.error))
  return result.data as Settings[K]
}

export async function getAllSettings(db: Database): Promise<Partial<Settings>> {
  const rows = await db.select().from(settings)
  return Object.fromEntries(
    rows.filter((row) => row.key in settingSchemas).map((row) => [row.key, row.value]),
  ) as Partial<Settings>
}

/** Sitenin ihtiyaç duyduğu ayarlar, tek dile indirgenmiş olarak. */
export async function getPublicSettings(db: Database, locale: Locale): Promise<PublicSiteSettings> {
  const all = await getAllSettings(db)
  return {
    general: all.general
      ? {
          siteName: all.general.siteName,
          logo: all.general.logo,
          tagline: all.general.tagline[locale],
          description: all.general.description[locale],
          dealerLoginUrl: all.general.dealerLoginUrl,
        }
      : null,
    contact: all.contact
      ? {
          phone: all.contact.phone,
          phoneLines: all.contact.phoneLines,
          fax: all.contact.fax,
          email: all.contact.email,
          address: all.contact.address[locale],
          hours: all.contact.hours[locale],
        }
      : null,
    social: all.social ?? null,
  }
}
