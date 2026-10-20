import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export type Database = ReturnType<typeof createDatabase>

/** "file:./data/karar.db" gibi yerel adreslerde klasörü oluşturur, SQLite ayarlarını uygular. */
export function createDatabase(url: string) {
  if (url.startsWith('file:') && !url.includes(':memory:')) {
    mkdirSync(dirname(resolve(url.slice('file:'.length))), { recursive: true })
  }
  const client = createClient({ url })
  return drizzle(client, { schema })
}

export async function configureSqlite(db: Database) {
  // Yabancı anahtar kısıtları SQLite'ta varsayılan olarak kapalıdır.
  await db.run('PRAGMA foreign_keys = ON')
  await db.run('PRAGMA journal_mode = WAL')
  await db.run('PRAGMA busy_timeout = 5000')
}
