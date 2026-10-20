import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Lütfen adınızı girin.'),
  email: z.email('Geçerli bir e-posta adresi girin.'),
  company: z.string().trim().optional(),
  subject: z.enum(['Bayilik', 'İhracat', 'Proje / Otel', 'Diğer']),
  message: z.string().trim().min(10, 'Mesajınız en az 10 karakter olmalı.'),
})

export type ContactInput = z.infer<typeof contactSchema>

// Demo: backend olmadığı için gönderim simüle edilir.
// Backend gelince: return http<void>('/api/contact', { method: 'POST', body: JSON.stringify(input) })
export async function sendContactMessage(input: ContactInput): Promise<void> {
  void input
  await new Promise((resolve) => setTimeout(resolve, 600))
}
