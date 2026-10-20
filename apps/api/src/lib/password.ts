import { hash, verify } from '@node-rs/argon2'

// argon2id (kütüphane varsayılanı) — OWASP önerisine yakın parametreler.
const options = { memoryCost: 19_456, timeCost: 2, parallelism: 1 }

export function hashPassword(password: string) {
  return hash(password, options)
}

export async function verifyPassword(passwordHash: string, password: string) {
  try {
    return await verify(passwordHash, password)
  } catch {
    return false
  }
}
