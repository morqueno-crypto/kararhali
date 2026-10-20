import type { Localized } from '@/i18n'

export type CollectionCategory = 'carpet' | 'roll'

/** Veri kaynağındaki koleksiyon kaydı. */
export interface CollectionRecord {
  slug: string
  name: string
  category: CollectionCategory
  /** Ham ölçüler: halı için "200x290", rulo için "200xR" (en × rulo). */
  sizes: readonly string[]
  /** Kapak görseli yolu (asset köküne göre). Yoksa ilk modelin fotoğrafı kullanılır. */
  cover?: string
  /** Model görsel dosya adları, ör. "6055A_KAHVE" → laguna/6055A_KAHVE.jpg */
  models: readonly string[]
  description: Localized
  featured?: boolean
}

export interface ProductModel {
  slug: string
  collectionSlug: string
  /** Desen kodu, ör. "6055A" */
  code: string
  colorKey: string
  color: string
  hex: string
  image: string
}

/** Arayüze verilen, tek dile çevrilmiş koleksiyon. */
export interface Collection {
  slug: string
  name: string
  category: CollectionCategory
  sizes: readonly string[]
  cover: string
  description: string
  featured: boolean
  models: ProductModel[]
}
