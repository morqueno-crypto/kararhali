import { useSearchParams } from 'react-router'
import { cn } from '@/lib/cn'
import type { Collection, CollectionCategory } from '@/types/collection'
import { CollectionCard } from './collection-card'

const ALL = 'Tümü'
const CATEGORY_PARAM = 'kategori'

export function CollectionBrowser({ collections }: { collections: Collection[] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = [...new Set(collections.map((c) => c.category))] as CollectionCategory[]
  const active = searchParams.get(CATEGORY_PARAM) ?? ALL
  const visible = active === ALL ? collections : collections.filter((c) => c.category === active)

  function select(category: string) {
    setSearchParams(category === ALL ? {} : { [CATEGORY_PARAM]: category }, {
      preventScrollReset: true,
    })
  }

  return (
    <div>
      <div role="group" aria-label="Kategoriye göre filtrele" className="flex flex-wrap gap-2">
        {[ALL, ...categories].map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={active === category}
            onClick={() => select(category)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active === category
                ? 'bg-ink-950 text-cream-50'
                : 'bg-cream-100 text-ink-700 ring-1 ring-ink-900/10 hover:bg-cream-200',
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-ink-500">Bu kategoride henüz koleksiyon bulunmuyor.</p>
      )}
    </div>
  )
}
