import { z } from 'zod'

export const locales = ['tr', 'en'] as const
export const localeSchema = z.enum(locales)
export type Locale = z.infer<typeof localeSchema>

/** Her dil için ayrı değer: { tr, en } */
export function localized<T extends z.ZodType>(schema: T) {
  return z.object({ tr: schema, en: schema })
}

export type Localized<T> = Record<Locale, T>

export const localizedText = localized(z.string().trim().min(1).max(500))
export const localizedLongText = localized(z.string().trim().min(1).max(5000))

/** URL dostu kimlik: küçük harf, rakam ve tire. */
export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Yalnızca küçük harf, rakam ve tire kullanılabilir')

/** Görsel adresi: tam URL veya API'nin servis ettiği /uploads/... yolu. */
export const imageRefSchema = z
  .string()
  .trim()
  .min(1)
  .max(1000)
  .refine(
    (value) => value.startsWith('/uploads/') || /^https?:\/\//.test(value),
    'Görsel tam bir URL veya /uploads/ ile başlayan bir yol olmalı',
  )

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() })

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
}

/** API hata gövdesi */
export interface ApiErrorBody {
  error: {
    code: string
    message: string
    details?: unknown
  }
}
