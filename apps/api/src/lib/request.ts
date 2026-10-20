import { getConnInfo } from '@hono/node-server/conninfo'
import type { Context } from 'hono'

/** İstemci IP'si. Ters vekil arkasındaysa (TRUST_PROXY=true) X-Forwarded-For kullanılır. */
export function getClientIp(c: Context, trustProxy: boolean) {
  if (trustProxy) {
    const forwarded = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }
  try {
    return getConnInfo(c).remote.address ?? 'unknown'
  } catch {
    // Testlerde (app.request) gerçek bir soket yoktur.
    return 'unknown'
  }
}
