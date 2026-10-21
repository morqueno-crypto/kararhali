import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url().optional(),
  VITE_SITE_URL: z.url().default('http://localhost:5173'),
})

export const env = envSchema.parse(import.meta.env)
