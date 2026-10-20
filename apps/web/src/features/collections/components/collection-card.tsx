import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { useI18n } from '@/i18n'
import type { Collection } from '@/types/collection'
import { CarpetSwatch } from './carpet-swatch'

export function CollectionCard({ collection }: { collection: Collection }) {
  const { t, path } = useI18n()

  return (
    <Link
      to={path('collectionDetail', { slug: collection.slug })}
      className="group flex flex-col overflow-hidden rounded-2xl bg-cream-100 ring-1 ring-ink-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:ring-ink-900/10"
    >
      <div className="flex aspect-4/3 items-center justify-center bg-cream-200 p-6">
        <CarpetSwatch
          pattern={collection.pattern}
          palette={collection.palette}
          className="h-full w-auto -rotate-6 transition-transform duration-500 group-hover:rotate-0"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-madder-600 uppercase">
          {t.collections.categories[collection.category]}
        </p>
        <h3 className="mt-2 flex items-center justify-between text-2xl font-medium text-ink-950">
          {collection.name}
          <ArrowUpRight
            className="size-5 text-ink-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-madder-600"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">{collection.summary}</p>
        <p className="mt-auto pt-4 text-xs text-ink-500">
          {collection.material} · {collection.technique}
        </p>
      </div>
    </Link>
  )
}
