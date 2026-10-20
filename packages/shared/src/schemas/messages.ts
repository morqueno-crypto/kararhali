import { z } from 'zod'
import { localeSchema } from './common'

export const contactSubjects = ['dealership', 'export', 'project', 'other'] as const
export const contactSubjectSchema = z.enum(contactSubjects)

/** İletişim formu (sitedeki form ve API aynı kuralları kullanır). */
export const contactInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim(),
  company: z.string().trim().max(120).optional(),
  subject: contactSubjectSchema,
  message: z.string().trim().min(10).max(5000),
  locale: localeSchema.default('tr'),
  /**
   * Bot tuzağı: formda gizli alan; gerçek kullanıcılar boş bırakır.
   * Doluysa API 201 döner ama kaydetmez (hata dönmek tuzağı ele verirdi).
   */
  website: z.string().max(500).optional(),
})
export type ContactInput = z.infer<typeof contactInputSchema>

export const messageStatuses = ['new', 'read', 'archived'] as const
export const messageStatusSchema = z.enum(messageStatuses)

export const messageUpdateSchema = z.object({ status: messageStatusSchema })
