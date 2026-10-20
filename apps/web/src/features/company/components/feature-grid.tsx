import { cn } from '@/lib/cn'

interface FeatureGridProps {
  items: readonly { title: string; text: string }[]
  /** Kartlarda 01, 02 ... numarası gösterilsin mi */
  numbered?: boolean
  columns?: 3 | 4
  className?: string
}

/** Değerler, ilkeler ve üretim adımları için ortak kart ızgarası. */
export function FeatureGrid({ items, numbered, columns = 4, className }: FeatureGridProps) {
  return (
    <ol
      className={cn(
        'grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={item.title} className="flex flex-col bg-surface p-8">
          {numbered && (
            <span className="font-display text-sm font-medium text-accent tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          <h3 className={cn('text-xl font-semibold text-ink', numbered && 'mt-6')}>{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
        </li>
      ))}
    </ol>
  )
}
