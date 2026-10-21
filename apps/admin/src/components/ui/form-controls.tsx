import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const control =
  'block w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-ink placeholder:text-subtle transition-colors hover:border-line-strong focus:border-accent focus:outline-none aria-invalid:border-danger disabled:opacity-60'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'h-10', className)} {...props} />
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      rows={rows}
      className={cn(control, 'resize-y py-2.5 leading-relaxed', className)}
      {...props}
    />
  )
}

export function NativeSelect({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <select className={cn(control, 'h-10 appearance-none pr-9', className)} {...props}>
      {children}
    </select>
  )
}

interface FieldProps {
  label: string
  /** Alanın altında açıklama */
  hint?: ReactNode
  error?: string
  className?: string
  /** id ve aria bağlantılarını alan çocuk */
  children: (props: {
    id: string
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }) => ReactNode
}

/** Etiket + kontrol + açıklama/hata. Kontrol, erişilebilirlik özniteliklerini fonksiyon olarak alır. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-xs font-semibold text-muted">
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
