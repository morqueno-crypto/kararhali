import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Her test dosyası kendi bellek içi veritabanını kullanır.
    pool: 'forks',
  },
})
