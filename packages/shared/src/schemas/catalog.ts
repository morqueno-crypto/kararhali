import { z } from 'zod'
import { imageRefSchema, localizedLongText, localizedText, slugSchema } from './common'

export const collectionCategories = ['carpet', 'roll'] as const
export const collectionCategorySchema = z.enum(collectionCategories)
export type CollectionCategory = z.infer<typeof collectionCategorySchema>

/** "200x290" (halı) veya "200xR" (rulo: en × istenen boy) */
export const sizeSchema = z
  .string()
  .trim()
  .regex(/^\d{2,3}x(\d{2,3}|R)$/, 'Ebat 200x290 veya 200xR biçiminde olmalı')

// ── Renkler ─────────────────────────────────────────────────────────────
export const colorKeySchema = z
  .string()
  .trim()
  .regex(/^[A-Z]{2,20}$/, 'Renk kodu büyük harflerden oluşmalı (ör. KAHVE, AGRI)')

export const colorInputSchema = z.object({
  key: colorKeySchema,
  name: localizedText,
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Renk #RRGGBB biçiminde olmalı'),
})
export const colorUpdateSchema = colorInputSchema.omit({ key: true }).partial()
export type ColorInput = z.infer<typeof colorInputSchema>

// ── Koleksiyonlar ───────────────────────────────────────────────────────
export const collectionInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1).max(80),
  category: collectionCategorySchema,
  sizes: z.array(sizeSchema).min(1).max(12),
  coverImage: imageRefSchema.nullable().default(null),
  description: localizedLongText,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
})
export const collectionUpdateSchema = collectionInputSchema.partial()
export type CollectionInput = z.infer<typeof collectionInputSchema>

// ── Modeller (bir koleksiyondaki desen + renk) ──────────────────────────
export const modelCodeSchema = z
  .string()
  .trim()
  .regex(/^[0-9A-Z]{3,10}$/, 'Desen kodu büyük harf ve rakamlardan oluşmalı (ör. 6055A)')

export const modelInputSchema = z.object({
  collectionId: z.number().int().positive(),
  code: modelCodeSchema,
  colorKey: colorKeySchema,
  /** Boş bırakılırsa kod + renkten üretilir (ör. 6055a-kahve). */
  slug: slugSchema.optional(),
  image: imageRefSchema,
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
})
export const modelUpdateSchema = modelInputSchema.omit({ collectionId: true }).partial()
export type ModelInput = z.infer<typeof modelInputSchema>

export const reorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
})

// ── Herkese açık API yanıtları (tek dile çevrilmiş) ─────────────────────
export interface PublicModel {
  slug: string
  collectionSlug: string
  code: string
  colorKey: string
  color: string
  hex: string
  image: string
}

export interface PublicCollection {
  slug: string
  name: string
  category: CollectionCategory
  sizes: string[]
  cover: string
  description: string
  featured: boolean
  models: PublicModel[]
}

export interface PublicModelDetail {
  collection: PublicCollection
  model: PublicModel
  /** Aynı desenin diğer renkleri */
  variants: PublicModel[]
  /** Koleksiyondaki diğer desenler */
  related: PublicModel[]
}
