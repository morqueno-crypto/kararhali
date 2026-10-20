export type PatternKind = 'medallion' | 'geometric' | 'stripe' | 'grid'

export type CollectionCategory = 'Klasik' | 'Modern' | 'Kilim' | 'Dış Mekân'

export interface Collection {
  slug: string
  name: string
  category: CollectionCategory
  summary: string
  description: string
  pattern: PatternKind
  /** [zemin, ana desen, detay] */
  palette: readonly [string, string, string]
  material: string
  pileHeight: string
  technique: string
  sizes: readonly string[]
  features: readonly string[]
  featured?: boolean
}
