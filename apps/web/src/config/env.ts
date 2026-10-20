import { z } from 'zod'

const envSchema = z.object({
  /**
   * API kökü. Boş bırakılırsa istekler aynı adrese gider (/api/...): geliştirmede Vite proxy,
   * canlıda aynı alan adı altında yayın. Ayrı bir alan adındaysa tam adres verin.
   */
  VITE_API_URL: z.url().optional(),
})

export const env = envSchema.parse(import.meta.env)
