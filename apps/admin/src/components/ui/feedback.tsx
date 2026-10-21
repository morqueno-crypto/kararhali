import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { errorMessage } from '@/lib/http'
import { Button } from './button'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-raised', className)} aria-hidden="true" />
}

export function Spinner({ label = 'Yükleniyor…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-subtle">
      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-raised text-subtle">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-base font-bold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-subtle">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Sorgu hatası: mesaj + tekrar dene */
export function QueryError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <AlertTriangle className="text-danger size-6" aria-hidden="true" />
      <p className="text-sm text-muted">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tekrar dene
        </Button>
      )}
    </div>
  )
}
