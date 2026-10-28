import { Sparkle } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '@/lib/cn'

/**
 * Sonsuz kayan isim şeridi (koleksiyon adları). Süs amaçlıdır: isimler sayfada başka yerde de geçtiği için
 * ekran okuyuculardan gizlenir. Fare üstüne gelince durur; reduced-motion açıksa hiç kaymaz.
 */
export function MarqueeBand({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  // İçerik iki kez yan yana dizilir; şerit yarısı kadar kayınca başa sarar ve dikiş görünmez.
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <span
            className={cn(
              'font-display text-5xl font-semibold whitespace-nowrap sm:text-7xl',
              index % 2 === 0 ? 'text-ink' : 'text-outline',
            )}
          >
            {item}
          </span>
          <Sparkle
            className={cn('size-7 shrink-0', index % 2 === 0 ? 'text-accent' : 'text-accent-2')}
            aria-hidden="true"
          />
        </Fragment>
      ))}
    </div>
  )

  return (
    <div
      aria-hidden="true"
      className={cn(
        'group relative overflow-hidden border-y border-line bg-linear-to-r from-accent/10 via-accent-2/10 to-accent/10 py-6 sm:py-8',
        className,
      )}
    >
      <div className="flex w-max group-hover:[animation-play-state:paused] motion-safe:animate-marquee">
        {row}
        {row}
      </div>
      {/* Kenarlarda yumuşak kaybolma */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-canvas to-transparent" />
    </div>
  )
}
