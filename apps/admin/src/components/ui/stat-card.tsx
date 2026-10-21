import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'
import { formatNumber } from '@/lib/format'

const tones = {
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  info: 'bg-info/15 text-info',
  danger: 'bg-danger/15 text-danger',
  warning: 'bg-warning/15 text-warning',
} as const

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone?: keyof typeof tones
  /** Değerin altında küçük not (ör. "9 halı · 13 rulo") */
  footnote?: ReactNode
  to?: string
}

/** Metrik kartı: etiket, büyük rakam, renkli ikon kutusu (referanstaki KPI satırı). */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'accent',
  footnote,
  to,
}: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-wider text-subtle uppercase">{label}</p>
        <span
          className={cn('inline-flex size-10 items-center justify-center rounded-xl', tones[tone])}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold text-ink tabular-nums">
        {formatNumber(value)}
      </p>
      {footnote && <p className="mt-1.5 text-xs text-subtle">{footnote}</p>}
    </>
  )

  const className =
    'group block rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-line-strong'
  return to ? (
    <Link to={to} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}
