import { defineConfig } from 'tsup'

// Üretim derlemesi: tek bir ESM dosyası. Ortak paket (TS kaynağı) içine gömülür,
// native bağımlılıklar (libsql, argon2) dışarıda kalır.
export default defineConfig({
  entry: ['src/server.ts', 'src/db/migrate.ts', 'src/db/seed.ts'],
  format: 'esm',
  target: 'node24',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  noExternal: ['@karar-hali/shared'],
})
