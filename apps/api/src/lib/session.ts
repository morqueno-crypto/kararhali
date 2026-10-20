import { createHash, randomBytes } from 'node:crypto'
import type { PublicUser } from '@karar-hali/shared'
import { and, eq, ne } from 'drizzle-orm'
import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import type { AppBindings } from '../context'
import { sessions, users } from '../db/schema'
import { getClientIp } from './request'

export const SESSION_COOKIE = 'karar_session'
const DAY_MS = 24 * 60 * 60 * 1000

/** Çerezdeki token'ın SHA-256 özeti veritabanında kimlik olarak saklanır. */
function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function toPublicUser(row: typeof users.$inferSelect): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    active: row.active,
    lastLoginAt: row.lastLoginAt,
    createdAt: row.createdAt,
  }
}

function writeCookie(c: Context<AppBindings>, token: string, expiresAt: Date) {
  const { env } = c.get('deps')
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function createSession(c: Context<AppBindings>, userId: number) {
  const { db, env } = c.get('deps')
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_DAYS * DAY_MS)

  await db.insert(sessions).values({
    id: hashToken(token),
    userId,
    expiresAt: expiresAt.toISOString(),
    userAgent: c.req.header('user-agent')?.slice(0, 300) ?? null,
    ip: getClientIp(c, env.TRUST_PROXY),
  })
  writeCookie(c, token, expiresAt)
}

/** Geçerli oturum ve aktif kullanıcıyı döner; süresi dolmuşsa siler. Süresinin yarısı geçtiyse uzatır. */
export async function loadSession(c: Context<AppBindings>) {
  const token = getCookie(c, SESSION_COOKIE)
  if (!token) return null

  const { db, env } = c.get('deps')
  const id = hashToken(token)
  const [row] = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(eq(sessions.id, id))
    .limit(1)

  if (!row) return null
  const expiresAt = new Date(row.session.expiresAt).getTime()
  if (expiresAt <= Date.now() || !row.user.active) {
    await db.delete(sessions).where(eq(sessions.id, id))
    deleteCookie(c, SESSION_COOKIE, { path: '/' })
    return null
  }

  const ttl = env.SESSION_TTL_DAYS * DAY_MS
  if (expiresAt - Date.now() < ttl / 2) {
    const renewed = new Date(Date.now() + ttl)
    await db.update(sessions).set({ expiresAt: renewed.toISOString() }).where(eq(sessions.id, id))
    writeCookie(c, token, renewed)
  }

  return { sessionId: id, user: toPublicUser(row.user) }
}

export async function destroySession(c: Context<AppBindings>) {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) {
    await c
      .get('deps')
      .db.delete(sessions)
      .where(eq(sessions.id, hashToken(token)))
  }
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
}

/** Bir kullanıcının (isteğe bağlı olarak biri hariç) tüm oturumlarını kapatır. */
export async function revokeUserSessions(
  c: Context<AppBindings>,
  userId: number,
  exceptId?: string,
) {
  const { db } = c.get('deps')
  const byUser = eq(sessions.userId, userId)
  await db.delete(sessions).where(exceptId ? and(byUser, ne(sessions.id, exceptId)) : byUser)
}
