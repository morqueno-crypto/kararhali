import { z } from 'zod'
import { imageRefSchema, localized } from './common'

/*
 * İçerik blokları: sitedeki tüm düzenlenebilir metin ve görseller.
 * Her bloğun verisi dile göre tutulur: { tr: {...}, en: {...} }.
 * Arayüzdeki küçük sabit etiketler (menü, buton metinleri) kodda kalır; sayfa içerikleri buradadır.
 */

const text = z.string().trim().min(1).max(300)
const optionalText = z.string().trim().max(300).default('')
const longText = z.string().trim().min(1).max(3000)

const heading = {
  eyebrow: text,
  title: text,
  /** Başlık içinde vurgulanacak parça; başlıkta geçmelidir (boş olabilir). */
  titleAccent: optionalText,
}

const item = z.object({ title: text, text: longText })
const slide = z.object({
  image: imageRefSchema,
  imageAlt: text,
  eyebrow: text,
  title: text,
  /** Başlıkta vurgulanacak kelime(ler); boş olabilir. */
  titleAccent: optionalText,
  text: longText,
})
const stat = z.object({ value: z.string().trim().min(1).max(30), label: text })

/**
 * Ana sayfadaki üretim yolculuğunun bölümleri. Sıra ve anahtarlar sabittir: her bölümün sahnesi
 * (animasyonu) sitede koddadır; metinleri panelden düzenlenir.
 */
export const journeyChapterKeys = [
  'creel',
  'warp',
  'weaving',
  'shearing',
  'binding',
  'quality',
  'packing',
  'shipping',
] as const
export type JourneyChapterKey = (typeof journeyChapterKeys)[number]

const chapter = z.object({
  /** Kısa ad (ilerleme çubuğunda) */
  label: z.string().trim().min(1).max(40),
  title: text,
  text: longText,
  /** Öne çıkan kısa bilgi */
  fact: text,
})

const chapters = z.object(
  Object.fromEntries(journeyChapterKeys.map((key) => [key, chapter])) as Record<
    JourneyChapterKey,
    typeof chapter
  >,
)

export const contentBlockSchemas = {
  /** Ana sayfa: tezgâhtan sevkiyata üretim hikâyesi */
  'home.journey': localized(
    z.object({
      ...heading,
      text: longText,
      scrollCue: text,
      chapters,
      finaleEyebrow: text,
      finaleTitle: text,
      finaleTitleAccent: optionalText,
    }),
  ),
  'home.hero': localized(
    z.object({
      ...heading,
      text: longText,
      primaryCta: text,
      secondaryCta: text,
      image: imageRefSchema,
      imageAlt: text,
    }),
  ),
  /** Ana sayfa giriş slaytları (butonlar home.hero'dan gelir) */
  'home.slides': localized(z.object({ items: z.array(slide).min(1).max(8) })),
  'home.featured': localized(z.object({ ...heading, description: longText, cta: text })),
  'home.categories': localized(
    z.object({
      carpetsTitle: text,
      carpetsText: longText,
      carpetsImage: imageRefSchema,
      rollsTitle: text,
      rollsText: longText,
      rollsImage: imageRefSchema,
      cta: text,
    }),
  ),
  'home.story': localized(z.object({ ...heading, text: longText, cta: text })),
  'home.values': localized(z.object(heading)),
  'company.stats': localized(z.object({ items: z.array(stat).min(1).max(8) })),
  'company.values': localized(z.object({ items: z.array(item).min(1).max(12) })),
  'company.pillars': localized(z.object({ items: z.array(item).min(1).max(12) })),
  'production.steps': localized(z.object({ items: z.array(item).min(1).max(12) })),
  'about.page': localized(
    z.object({
      ...heading,
      description: longText,
      image: imageRefSchema,
      storyEyebrow: text,
      storyTitle: text,
      story: z.array(longText).min(1).max(10),
      pillarsEyebrow: text,
      pillarsTitle: text,
      valuesEyebrow: text,
      valuesTitle: text,
      fairsEyebrow: text,
      fairsTitle: text,
      fairsText: longText,
      fairImages: z.array(imageRefSchema).max(12),
    }),
  ),
  'collections.page': localized(z.object({ ...heading, description: longText })),
  'production.page': localized(
    z.object({
      ...heading,
      description: longText,
      image: imageRefSchema,
      processEyebrow: text,
      processTitle: text,
      processDescription: longText,
      typesEyebrow: text,
      typesTitle: text,
      carpetsText: longText,
      carpetsImage: imageRefSchema,
      rollsText: longText,
      rollsImage: imageRefSchema,
    }),
  ),
  'contact.page': localized(z.object({ eyebrow: text, title: text, description: longText })),
  cta: localized(z.object({ title: text, text: longText, button: text })),
} as const

export type ContentKey = keyof typeof contentBlockSchemas
export const contentKeys = Object.keys(contentBlockSchemas) as ContentKey[]
export const contentKeySchema = z.enum(contentKeys as [ContentKey, ...ContentKey[]])

export type ContentBlock<K extends ContentKey> = z.infer<(typeof contentBlockSchemas)[K]>
/** Tek dile indirgenmiş blok verisi */
export type LocalizedContent<K extends ContentKey> = ContentBlock<K>['tr']
export type PublicContent = { [K in ContentKey]: LocalizedContent<K> }

/** GET /site yanıtı. İçerikte yalnızca kaydı olan bloklar bulunur (seed hepsini oluşturur). */
export interface SiteResponse {
  locale: 'tr' | 'en'
  settings: import('./settings').PublicSiteSettings
  content: Partial<PublicContent>
}
