import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { useActionState, type ReactNode } from 'react'
import { buttonClass } from '@/components/ui/button-styles'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { HttpError } from '@/lib/http'
import {
  contactSubjects,
  createContactSchema,
  sendContactMessage,
  type ContactInput,
} from '@/services/contact'

type FieldErrors = Partial<Record<keyof ContactInput, string>>

type FormState =
  | { status: 'idle' }
  | {
      status: 'error'
      errors: FieldErrors
      values: Record<string, string>
      /** Alan dışı hata (ör. API'ye ulaşılamadı, hız sınırı) */
      formError?: string
    }
  | { status: 'success' }

const inputClass =
  'mt-2 block w-full rounded-xl border border-line bg-canvas px-4 py-3 text-ink placeholder:text-subtle transition-colors focus:border-accent focus:outline-none aria-invalid:border-red-400'

export function ContactForm() {
  const { t, locale } = useI18n()

  async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
    const values = Object.fromEntries(
      [...formData.entries()].map(([key, value]) => [key, String(value)]),
    )
    const result = createContactSchema(t.contact.validation).safeParse(values)

    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactInput
        errors[key] ??= issue.message
      }
      return { status: 'error', errors, values }
    }

    try {
      await sendContactMessage(result.data, locale)
      return { status: 'success' }
    } catch (error) {
      const formError =
        error instanceof HttpError && error.status === 429
          ? t.contact.errors.tooMany
          : t.contact.errors.generic
      return { status: 'error', errors: {}, values, formError }
    }
  }

  const [state, formAction, pending] = useActionState(submitContact, { status: 'idle' })

  if (state.status === 'success') {
    return (
      <div role="status" className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
        <CheckCircle2 className="size-10 text-accent" aria-hidden="true" />
        <h2 className="mt-5 text-2xl font-semibold text-ink">{t.contact.success.title}</h2>
        <p className="mt-2 text-muted">{t.contact.success.text}</p>
      </div>
    )
  }

  const errors = state.status === 'error' ? state.errors : {}
  const values = state.status === 'error' ? state.values : {}
  const { form } = t.contact

  return (
    <form
      action={formAction}
      noValidate
      className="relative grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-10"
    >
      <Field label={form.name} name="name" error={errors.name}>
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
      <Field label={form.email} name="email" error={errors.email}>
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
      <Field label={form.company} name="company">
        <input
          id="company"
          name="company"
          autoComplete="organization"
          defaultValue={values.company}
          className={inputClass}
        />
      </Field>
      <Field label={form.subject} name="subject" error={errors.subject}>
        <select
          id="subject"
          name="subject"
          defaultValue={values.subject ?? contactSubjects[0]}
          className={inputClass}
        >
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {t.contact.subjects[subject]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={form.message} name="message" error={errors.message} className="sm:col-span-2">
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
      {/* Bot tuzağı: kullanıcılardan ve ekran okuyuculardan gizli; dolduran istek API'de yok sayılır. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">{form.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2">
        {state.status === 'error' && state.formError && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {state.formError}
          </p>
        )}
        <button type="submit" disabled={pending} className={buttonClass('primary')}>
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
          {pending ? form.sending : form.submit}
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
      <label htmlFor={name} className="text-sm font-medium text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
