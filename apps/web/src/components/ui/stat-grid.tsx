import { cn } from '@/lib/cn'

interface StatGridProps {
  items: readonly { value: string; label: string }[]
  tone?: 'dark' | 'light'
  className?: string
}

export function StatGrid({ items, tone = 'dark', className }: StatGridProps) {
  return (
    <dl className={cn('grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4', className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'border-l-2 pl-5',
            tone === 'dark' ? 'border-madder-500' : 'border-madder-400',
          )}
        >
          <dt className={cn('text-sm', tone === 'dark' ? 'text-ink-500' : 'text-cream-300')}>
            {item.label}
          </dt>
          <dd
            className={cn(
              'mt-1 font-display text-3xl font-medium sm:text-4xl',
              tone === 'dark' ? 'text-ink-950' : 'text-cream-50',
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
