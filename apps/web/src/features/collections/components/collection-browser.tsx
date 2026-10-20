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
    { value: ALL, label: t.collections.all, count: collections.length },
    ...categories.map((category) => ({
      value: category,
      label: t.collections.categories[category],
      count: collections.filter((c) => c.category === category).length,
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
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active === option.value
                ? 'border-ink bg-ink text-canvas'
                : 'border-line text-muted hover:border-ink/40 hover:text-ink',
            )}
          >
            {option.label}
            <span className="text-xs tabular-nums opacity-60">{option.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>

      {visible.length === 0 && <p className="mt-10 text-muted">{t.collections.empty}</p>}
    </div>
  )
}
