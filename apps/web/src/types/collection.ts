import type { Localized } from '@/i18n'

export type PatternKind = 'medallion' | 'geometric' | 'stripe' | 'grid'

export type CollectionCategory = 'classic' | 'modern' | 'kilim' | 'outdoor'

/** Veri kaynağındaki (çok dilli) koleksiyon kaydı. */
export interface CollectionRecord {
  slug: string
  category: CollectionCategory
  pattern: PatternKind
  /** [zemin, ana desen, detay] */
  palette: readonly [string, string, string]
  sizes: readonly string[]
  featured?: boolean
  name: Localized
  summary: Localized
  description: Localized
  material: Localized
  pileHeight: Localized
  technique: Localized
  features: Localized<readonly string[]>
}

/** Arayüze verilen, tek dile çevrilmiş koleksiyon. */
export interface Collection extends Omit<
  CollectionRecord,
  'name' | 'summary' | 'description' | 'material' | 'pileHeight' | 'technique' | 'features'
> {
  name: string
  summary: string
  description: string
  material: string
  pileHeight: string
  technique: string
  features: readonly string[]
}
