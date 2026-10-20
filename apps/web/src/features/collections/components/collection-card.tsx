import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import type { Collection } from '@/types/collection'

interface CollectionCardProps {
  collection: Collection
  className?: string
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const { t, path } = useI18n()

  return (
    <Link
      to={path('collectionDetail', { slug: collection.slug })}
      className={cn(
        'group relative isolate flex aspect-4/5 flex-col justify-end overflow-hidden rounded-3xl border border-line bg-surface',
        className,
      )}
    >
      <RemoteImage
        src={collection.cover}
        alt={collection.name}
        className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/40 to-transparent"
        aria-hidden="true"
      />
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {t.collections.categories[collection.category]}
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-ink">{collection.name}</h3>
          <p className="mt-1 text-sm text-muted">
            {t.collections.modelCount(collection.models.length)}
          </p>
        </div>
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-canvas/40 text-ink backdrop-blur transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
