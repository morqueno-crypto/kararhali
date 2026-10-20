import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('Lumen Halı'),
  VITE_API_URL: z.url().optional(),
})

export const env = envSchema.parse(import.meta.env)
