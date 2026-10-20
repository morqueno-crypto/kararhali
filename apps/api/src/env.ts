import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1).default('file:./data/karar.db'),
  UPLOAD_DIR: z.string().min(1).default('./uploads'),
  PUBLIC_URL: z.url().default('http://localhost:3000'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:5174')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(7),
  /** Ters vekil (nginx vb.) arkasında X-Forwarded-For başlığına güven. */
  TRUST_PROXY: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  OWNER_EMAIL: z.string().default(''),
  OWNER_NAME: z.string().default(''),
  OWNER_PASSWORD: z.string().default(''),
})

export type Env = z.infer<typeof envSchema>

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const result = envSchema.safeParse(source)
  if (!result.success) {
    console.error('Geçersiz ortam değişkenleri:', z.flattenError(result.error).fieldErrors)
    throw new Error('Ortam değişkenleri doğrulanamadı')
  }
  return result.data
}
