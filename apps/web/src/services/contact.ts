import { z } from 'zod'

export const contactSubjects = ['dealership', 'export', 'project', 'other'] as const

export type ContactSubject = (typeof contactSubjects)[number]

interface ValidationMessages {
  name: string
  email: string
  message: string
}

/** Hata mesajları dile göre verildiği için şema bir fabrika fonksiyonuyla üretilir. */
export function createContactSchema(errors: ValidationMessages) {
  return z.object({
    name: z.string().trim().min(2, errors.name),
    email: z.email(errors.email),
    company: z.string().trim().optional(),
    subject: z.enum(contactSubjects),
    message: z.string().trim().min(10, errors.message),
  })
}

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>

// Demo: backend olmadığı için gönderim simüle edilir.
// Backend gelince: return http<void>('/api/contact', { method: 'POST', body: JSON.stringify(input) })
export async function sendContactMessage(input: ContactInput): Promise<void> {
  void input
  await new Promise((resolve) => setTimeout(resolve, 600))
}
