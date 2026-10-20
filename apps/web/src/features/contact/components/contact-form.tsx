import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { useActionState, type ReactNode } from 'react'
import { buttonClass } from '@/components/ui/button-styles'
import { cn } from '@/lib/cn'
import { contactSchema, sendContactMessage, type ContactInput } from '@/services/contact'

type FieldErrors = Partial<Record<keyof ContactInput, string>>

type FormState =
  | { status: 'idle' }
  | { status: 'error'; errors: FieldErrors; values: Record<string, string> }
  | { status: 'success' }

const subjects: ContactInput['subject'][] = ['Bayilik', 'İhracat', 'Proje / Otel', 'Diğer']

async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  )
  const result = contactSchema.safeParse(values)

  if (!result.success) {
    const errors: FieldErrors = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ContactInput
      errors[key] ??= issue.message
    }
    return { status: 'error', errors, values }
  }

  await sendContactMessage(result.data)
  return { status: 'success' }
}

const inputClass =
  'mt-2 block w-full rounded-xl border-0 bg-cream-50 px-4 py-3 text-ink-950 ring-1 ring-ink-900/15 placeholder:text-ink-300 focus:ring-2 focus:ring-madder-500 focus:outline-none'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, { status: 'idle' })

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-2xl bg-cream-100 p-8 ring-1 ring-ink-900/10">
        <CheckCircle2 className="size-10 text-madder-600" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-medium text-ink-950">Mesajınız alındı</h2>
        <p className="mt-2 text-ink-700">
          Teşekkür ederiz. Satış ekibimiz en kısa sürede sizinle iletişime geçecek.
        </p>
        <p className="mt-4 text-xs text-ink-500">
          Not: Bu bir demo sitedir, form gerçekte bir yere gönderilmez.
        </p>
      </div>
    )
  }

  const errors = state.status === 'error' ? state.errors : {}
  const values = state.status === 'error' ? state.values : {}

  return (
    <form action={formAction} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field label="Ad Soyad" name="name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          defaultValue={values.name}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={inputClass}
        />
      </Field>
      <Field label="E-posta" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={values.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={inputClass}
        />
      </Field>
      <Field label="Firma (isteğe bağlı)" name="company">
        <input
          id="company"
          name="company"
          autoComplete="organization"
          defaultValue={values.company}
          className={inputClass}
        />
      </Field>
      <Field label="Konu" name="subject" error={errors.subject}>
        <select
          id="subject"
          name="subject"
          defaultValue={values.subject ?? subjects[0]}
          className={inputClass}
        >
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </Field>
      <Field label="Mesajınız" name="message" error={errors.message} className="sm:col-span-2">
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass('primary')}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
          {pending ? 'Gönderiliyor…' : 'Mesajı Gönder'}
        </button>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  name: string
  error?: string
  className?: string
  children: ReactNode
}

function Field({ label, name, error, className, children }: FieldProps) {
  return (
    <div className={cn(className)}>
      <label htmlFor={name} className="text-sm font-medium text-ink-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-madder-600">
          {error}
        </p>
      )}
    </div>
  )
}
