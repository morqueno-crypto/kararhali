import type { CollectionCategory, Localized, Role } from '@karar-hali/shared'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

const now = () => new Date().toISOString()

const timestamps = {
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now).$onUpdateFn(now),
}

// ── Kullanıcılar ve oturumlar ───────────────────────────────────────────
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').$type<Role>().notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  lastLoginAt: text('last_login_at'),
  ...timestamps,
})

export const sessions = sqliteTable(
  'sessions',
  {
    /** Çerezdeki rastgele token'ın SHA-256 özeti (token'ın kendisi saklanmaz). */
    id: text('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: text('expires_at').notNull(),
    userAgent: text('user_agent'),
    ip: text('ip'),
    createdAt: text('created_at').notNull().$defaultFn(now),
  },
  (table) => [index('sessions_user_idx').on(table.userId)],
)

// ── Katalog ─────────────────────────────────────────────────────────────
export const colors = sqliteTable('colors', {
  key: text('key').primaryKey(),
  name: text('name', { mode: 'json' }).$type<Localized<string>>().notNull(),
  hex: text('hex').notNull(),
})

export const collections = sqliteTable(
  'collections',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    category: text('category').$type<CollectionCategory>().notNull(),
    sizes: text('sizes', { mode: 'json' }).$type<string[]>().notNull(),
    coverImage: text('cover_image'),
    description: text('description', { mode: 'json' }).$type<Localized<string>>().notNull(),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (table) => [index('collections_sort_idx').on(table.sortOrder)],
)

export const models = sqliteTable(
  'models',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    collectionId: integer('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    code: text('code').notNull(),
    colorKey: text('color_key')
      .notNull()
      .references(() => colors.key, { onDelete: 'restrict', onUpdate: 'cascade' }),
    slug: text('slug').notNull(),
    image: text('image').notNull(),
    published: integer('published', { mode: 'boolean' }).notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('models_collection_slug_idx').on(table.collectionId, table.slug),
    index('models_collection_sort_idx').on(table.collectionId, table.sortOrder),
  ],
)

// ── İçerik ve ayarlar (doğrulama şemaları @karar-hali/shared içinde) ────
export const contentBlocks = sqliteTable('content_blocks', {
  key: text('key').primaryKey(),
  data: text('data', { mode: 'json' }).$type<unknown>().notNull(),
  updatedAt: text('updated_at').notNull().$defaultFn(now).$onUpdateFn(now),
  updatedBy: integer('updated_by').references(() => users.id, { onDelete: 'set null' }),
})

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value', { mode: 'json' }).$type<unknown>().notNull(),
  updatedAt: text('updated_at').notNull().$defaultFn(now).$onUpdateFn(now),
  updatedBy: integer('updated_by').references(() => users.id, { onDelete: 'set null' }),
})

// ── Medya ve mesajlar ───────────────────────────────────────────────────
export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  /** Diskteki dosya adı (rastgele) */
  filename: text('filename').notNull().unique(),
  originalName: text('original_name').notNull(),
  url: text('url').notNull(),
  mime: text('mime').notNull(),
  size: integer('size').notNull(),
  alt: text('alt').notNull().default(''),
  uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull().$defaultFn(now),
})

export const contactMessages = sqliteTable(
  'contact_messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    locale: text('locale').notNull(),
    status: text('status').$type<'new' | 'read' | 'archived'>().notNull().default('new'),
    ip: text('ip'),
    createdAt: text('created_at').notNull().$defaultFn(now),
  },
  (table) => [index('contact_messages_status_idx').on(table.status, table.createdAt)],
)
