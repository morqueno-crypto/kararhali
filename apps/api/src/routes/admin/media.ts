import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import {
  allowedImageTypes,
  idParamSchema,
  maxUploadBytes,
  mediaUpdateSchema,
  paginationQuerySchema,
  type MediaItem,
} from '@karar-hali/shared'
import { count, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import type { AppBindings } from '../../context'
import { media } from '../../db/schema'
import { badRequest, HttpError, notFound } from '../../lib/errors'
import { validate } from '../../lib/validate'

type AllowedType = (typeof allowedImageTypes)[number]

const extensions: Record<AllowedType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

/** Dosya içeriğinin gerçekten beyan edilen görsel türü olduğunu "magic bytes" ile doğrular. */
function sniffImageType(bytes: Uint8Array): AllowedType | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg'
  if (bytes[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png'
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return 'image/avif'
  return null
}

function toMediaItem(row: typeof media.$inferSelect): MediaItem {
  return {
    id: row.id,
    url: row.url,
    filename: row.originalName,
    mime: row.mime,
    size: row.size,
    alt: row.alt,
    createdAt: row.createdAt,
  }
}

/** Görsel kütüphanesi. Dosyalar UPLOAD_DIR'e kaydedilir ve /uploads/... adresinden servis edilir. */
export const mediaRoutes = new Hono<AppBindings>()
  .get('/', validate('query', paginationQuerySchema), async (c) => {
    const { db } = c.get('deps')
    const { page, pageSize } = c.req.valid('query')
    const [rows, [total]] = await Promise.all([
      db
        .select()
        .from(media)
        .orderBy(desc(media.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ value: count() }).from(media),
    ])
    return c.json({ items: rows.map(toMediaItem), page, pageSize, total: total?.value ?? 0 })
  })

  .post(
    '/',
    bodyLimit({
      maxSize: maxUploadBytes + 64 * 1024,
      onError: () => {
        throw new HttpError(413, 'payload_too_large', 'Dosya en fazla 10 MB olabilir')
      },
    }),
    async (c) => {
      const { db, env } = c.get('deps')
      const body = await c.req.parseBody()
      const file = body.file
      if (!(file instanceof File)) {
        throw badRequest('Dosya gönderilmedi', { fieldErrors: { file: ['Bir görsel seçin'] } })
      }
      if (file.size > maxUploadBytes) {
        throw new HttpError(413, 'payload_too_large', 'Dosya en fazla 10 MB olabilir')
      }

      const bytes = new Uint8Array(await file.arrayBuffer())
      const type = sniffImageType(bytes)
      if (!type) {
        throw badRequest('Yalnızca JPEG, PNG, WebP veya AVIF görseller yüklenebilir', {
          fieldErrors: { file: ['Desteklenmeyen dosya türü'] },
        })
      }

      const directory = resolve(env.UPLOAD_DIR)
      await mkdir(directory, { recursive: true })
      const filename = `${randomUUID()}.${extensions[type]}`
      await writeFile(join(directory, filename), bytes)

      const alt = typeof body.alt === 'string' ? body.alt.slice(0, 300) : ''
      const [row] = await db
        .insert(media)
        .values({
          filename,
          originalName: file.name.slice(0, 200) || filename,
          url: `/uploads/${filename}`,
          mime: type,
          size: bytes.byteLength,
          alt,
          uploadedBy: c.get('user').id,
        })
        .returning()
      return c.json({ media: toMediaItem(row!) }, 201)
    },
  )

  .patch(
    '/:id',
    validate('param', idParamSchema),
    validate('json', mediaUpdateSchema),
    async (c) => {
      const [row] = await c
        .get('deps')
        .db.update(media)
        .set(c.req.valid('json'))
        .where(eq(media.id, c.req.valid('param').id))
        .returning()
      if (!row) throw notFound('Görsel bulunamadı')
      return c.json({ media: toMediaItem(row) })
    },
  )

  /** Kaydı ve diskteki dosyayı siler. Bu görseli kullanan içerikler kontrol edilmez. */
  .delete('/:id', validate('param', idParamSchema), async (c) => {
    const { db, env } = c.get('deps')
    const [row] = await db
      .delete(media)
      .where(eq(media.id, c.req.valid('param').id))
      .returning()
    if (!row) throw notFound('Görsel bulunamadı')
    await rm(join(resolve(env.UPLOAD_DIR), row.filename), { force: true })
    return c.body(null, 204)
  })
