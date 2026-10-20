import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { loadEnv } from '../env'
import { configureSqlite, createDatabase, type Database } from './client'

/**
 * drizzle/ klasöründeki SQL migration'larını sırayla uygular (uygulanmış olanları atlar).
 * Klasör çalışma dizinine göre bulunur; komutlar apps/api içinden çalıştırılır (pnpm bunu sağlar).
 */
export async function runMigrations(db: Database, migrationsFolder = resolve('drizzle')) {
  await migrate(db, { migrationsFolder })
}

// Doğrudan çalıştırıldığında: pnpm db:migrate
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const env = loadEnv()
  const db = createDatabase(env.DATABASE_URL)
  await configureSqlite(db)
  await runMigrations(db)
  console.log('Migration tamamlandı.')
}
