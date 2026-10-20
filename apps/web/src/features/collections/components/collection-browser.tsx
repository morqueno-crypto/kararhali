import { useSearchParams } from 'react-router'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import type { Collection, CollectionCategory } from '@/types/collection'
import { CollectionCard } from './collection-card'

const ALL = 'all'
const CATEGORY_PARAM = 'category'

export function CollectionBrowser({ collections }: { collections: Collection[] }) {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const categories = [...new Set(collections.map((c) => c.category))]
  const active = searchParams.get(CATEGORY_PARAM) ?? ALL
  const visible = active === ALL ? collections : collections.filter((c) => c.category === active)

  function select(category: CollectionCategory | typeof ALL) {
    setSearchParams(category === ALL ? {} : { [CATEGORY_PARAM]: category }, {
      preventScrollReset: true,
    })
  }

  const options = [
    { value: ALL, label: t.collections.all },
    ...categories.map((category) => ({
      value: category,
      label: t.collections.categories[category],
    })),
  ] as const

  return (
    <div>
      <div role="group" aria-label={t.collections.filterLabel} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={active === option.value}
            onClick={() => select(option.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              active === option.value
                ? 'bg-ink-950 text-cream-50'
                : 'bg-cream-100 text-ink-700 ring-1 ring-ink-900/10 hover:bg-cream-200',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>

      {visible.length === 0 && <p className="mt-10 text-ink-500">{t.collections.empty}</p>}
    </div>
  )
}
