import {
  contentBlockSchemas,
  locales,
  type ContentBlock,
  type ContentKey,
  type Locale,
  type PublicContent,
} from '@karar-hali/shared'
import { z } from 'zod'
import type { Database } from '../db/client'
import { contentBlocks } from '../db/schema'
import { badRequest } from '../lib/errors'

/**
 * İçerik bloğunu şemasıyla doğrular. Ek kural: titleAccent doluysa başlıkta geçmelidir
 * (sitede vurgu, başlık metni içinde aranarak uygulanır).
 */
export function parseContentBlock<K extends ContentKey>(key: K, data: unknown): ContentBlock<K> {
  // Anahtara göre seçilen şemaların birleşimi tek tipe indirgenemediği için genel ZodType olarak ele alınır.
  const schema: z.ZodType = contentBlockSchemas[key]
  const result = schema.safeParse(data)
  if (!result.success) {
    throw badRequest('İçerik verisi geçersiz', z.flattenError(result.error))
  }
  const parsed = result.data as ContentBlock<K>
  for (const locale of locales) {
    const value = parsed[locale] as { title?: string; titleAccent?: string }
    if (value.titleAccent && value.title && !value.title.includes(value.titleAccent)) {
      throw badRequest(`${locale.toUpperCase()}: Vurgulanan parça başlıkta geçmiyor`, {
        fieldErrors: { [`${locale}.titleAccent`]: ['Başlıkta geçen bir parça olmalı'] },
      })
    }
  }
  return parsed
}

/** Tüm blokları tek dile indirger. Henüz kaydı olmayan bloklar yanıtta yer almaz. */
export async function getPublicContent(db: Database, locale: Locale) {
  const rows = await db.select().from(contentBlocks)
  const content: Partial<PublicContent> = {}
  for (const row of rows) {
    if (!(row.key in contentBlockSchemas)) continue
    const data = row.data as Record<Locale, unknown>
    ;(content as Record<string, unknown>)[row.key] = data[locale]
  }
  return content
}
