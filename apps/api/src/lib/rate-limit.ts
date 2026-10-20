import { tooManyRequests } from './errors'

/**
 * Basit bellek içi hız sınırlayıcı (tek süreçli yerel/küçük kurulumlar için yeterli).
 * Birden fazla sunucu örneğinde Redis gibi paylaşılan bir depoya taşınmalıdır.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, { count: number; resetAt: number }>()

  return {
    /** Sınır aşıldıysa 429 fırlatır. */
    hit(key: string) {
      const now = Date.now()
      const entry = hits.get(key)
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs })
        return
      }
      entry.count += 1
      if (entry.count > limit) throw tooManyRequests()
    },
    reset(key: string) {
      hits.delete(key)
    },
  }
}
