import { ArrowUpRight } from 'lucide-react'
import { ViewTransition } from 'react'
import { Link } from 'react-router'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { useTilt } from '@/lib/motion/pointer-effects'
import type { Collection } from '@/types/collection'
import { collectionImageTransition } from '../transition-names'

interface CollectionCardProps {
  collection: Collection
  className?: string
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const { t, path } = useI18n()
  const tilt = useTilt<HTMLAnchorElement>()

  return (
    <Link
      to={path('collectionDetail', { slug: collection.slug })}
      data-cursor={t.common.explore}
      {...tilt}
      className={cn(
        'group relative isolate flex aspect-4/5 flex-col justify-end overflow-hidden rounded-3xl border border-line bg-surface transition-[transform,border-color] duration-500 ease-(--ease-out-expo) will-change-transform hover:border-ink/25',
        className,
      )}
    >
      {/* Detay sayfasına geçişte bu görsel kutusu sayfanın üst görseline dönüşür (shared element) */}
      <ViewTransition
        name={collectionImageTransition(collection.slug)}
        share="morph"
        default="none"
      >
        <div className="absolute inset-0 -z-20 overflow-hidden">
          {/* Parallax katmanı: kaydırma animasyonları bu sarmalayıcıyı hareket ettirir */}
          <div data-parallax className="absolute -inset-x-[8%] inset-y-0">
            <RemoteImage
              src={collection.cover}
              alt={collection.name}
              className="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-110"
            />
          </div>
        </div>
      </ViewTransition>
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"
        aria-hidden="true"
      />
      <div className="flex items-end justify-between gap-4 p-6">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {t.collections.categories[collection.category]}
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-ink transition-transform duration-500 ease-(--ease-out-expo) group-hover:-translate-y-1">
            {collection.name}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {t.collections.modelCount(collection.models.length)}
          </p>
        </div>
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-canvas/40 text-ink backdrop-blur transition-all duration-500 ease-(--ease-out-expo) group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
      {/* Kenarda kendini çizen "iplik" */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-x-100"
      />
    </Link>
  )
}
