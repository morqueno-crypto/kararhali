import { CountUp } from '@/components/ui/count-up'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/cn'

interface StatGridProps {
  items: readonly { value: string; label: string }[]
  className?: string
}

export function StatGrid({ items, className }: StatGridProps) {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line lg:grid-cols-4',
        className,
      )}
    >
      {items.map((item, index) => (
        <Reveal
          key={item.label}
          variant="fade"
          delay={index * 90}
          className="group flex flex-col gap-2 bg-surface p-6 transition-colors hover:bg-raised sm:p-8"
        >
          <dt className="text-sm text-subtle">{item.label}</dt>
          <dd className="order-first font-display text-4xl font-semibold text-ink transition-colors group-hover:text-accent sm:text-5xl">
            <CountUp value={item.value} />
          </dd>
        </Reveal>
      ))}
    </dl>
  )
}
