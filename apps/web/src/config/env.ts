import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Karar Halı'),
  VITE_API_URL: z.url().optional(),
  /** Ürün ve kapak görsellerinin kökü. Şimdilik kararhali.com; ileride CDN/backend. */
  VITE_ASSET_BASE_URL: z.url().default('https://www.kararhali.com/assets/img'),
})

export const env = envSchema.parse(import.meta.env)
