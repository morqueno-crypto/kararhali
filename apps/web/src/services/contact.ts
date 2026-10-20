import { contactSubjects, type ContactInput as ApiContactInput } from '@karar-hali/shared'
import { z } from 'zod'
import type { Locale } from '@/i18n'
import { http } from '@/lib/http'

export { contactSubjects }
export type ContactSubject = (typeof contactSubjects)[number]

interface ValidationMessages {
  name: string
  email: string
  message: string
}

/**
 * Formdaki anlık doğrulama. Kurallar API'deki contactInputSchema ile aynıdır;
 * yalnızca hata mesajları dile göre verildiği için şema burada bir fabrika fonksiyonuyla üretilir.
 */
export function createContactSchema(errors: ValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, errors.name).max(120),
    email: z.email(errors.email),
    company: z.string().trim().max(120).optional(),
    subject: z.enum(contactSubjects),
    message: z.string().trim().min(10, errors.message).max(5000),
    /** Gizli bot tuzağı alanı */
    website: z.string().optional(),
  })
}

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>

export async function sendContactMessage(input: ContactInput, locale: Locale) {
  const body: ApiContactInput = { ...input, company: input.company || undefined, locale }
  await http<{ ok: true }>('/api/v1/contact', { method: 'POST', json: body })
}
