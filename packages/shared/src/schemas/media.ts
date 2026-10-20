import { z } from 'zod'

export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const
export const maxUploadBytes = 10 * 1024 * 1024

export const mediaUpdateSchema = z.object({
  alt: z.string().trim().max(300),
})

export interface MediaItem {
  id: number
  url: string
  filename: string
  mime: string
  size: number
  alt: string
  createdAt: string
}
