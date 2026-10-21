import type { CollectionCategory } from './catalog'
import type { Localized } from './common'
import type { ContentKey } from './content'
import type { SettingKey, Settings } from './settings'

/*
 * Yönetim uçlarının yanıt tipleri (admin paneli bunları kullanır).
 * Herkese açık uçların aksine çok dilli alanlar { tr, en } olarak döner.
 */

export interface AdminColor {
  key: string
  name: Localized<string>
  hex: string
}

export interface AdminCollection {
  id: number
  slug: string
  name: string
  category: CollectionCategory
  sizes: string[]
  coverImage: string | null
  description: Localized<string>
  featured: boolean
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AdminCollectionListItem extends AdminCollection {
  modelCount: number
}

export interface AdminModel {
  id: number
  collectionId: number
  code: string
  colorKey: string
  slug: string
  image: string
  published: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AdminContentItem<K extends ContentKey = ContentKey> {
  key: K
  data: unknown
  updatedAt: string | null
}

export interface AdminSettingItem<K extends SettingKey = SettingKey> {
  key: K
  value: Settings[K] | null
  updatedAt: string | null
}

export type MessageStatus = 'new' | 'read' | 'archived'

export interface ContactMessage {
  id: number
  name: string
  email: string
  company: string | null
  subject: string
  message: string
  locale: string
  status: MessageStatus
  ip: string | null
  createdAt: string
}

export interface DashboardData {
  collectionCount: number
  modelCount: number
  mediaCount: number
  newMessages: number
  userCount: number
  /** Kategoriye göre koleksiyon sayısı */
  collectionsByCategory: Record<CollectionCategory, number>
  /** Son 14 gün, eskiden yeniye: { date: 'YYYY-MM-DD', count } */
  messagesByDay: { date: string; count: number }[]
  recentMessages: ContactMessage[]
  /** Son güncellenen içerik blokları */
  recentContent: { key: ContentKey; updatedAt: string }[]
}
