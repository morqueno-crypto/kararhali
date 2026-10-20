import { Link } from 'react-router'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import type { ProductModel } from '@/types/collection'

interface ModelCardProps {
  model: ProductModel
  active?: boolean
}

export function ModelCard({ model, active }: ModelCardProps) {
  const { t, path } = useI18n()

  return (
    <Link
      to={path('modelDetail', { slug: model.collectionSlug, model: model.slug })}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-surface transition-colors',
        active ? 'border-accent' : 'border-line hover:border-ink/30',
      )}
    >
      <div className="aspect-11/16 overflow-hidden bg-paper p-4">
        <RemoteImage
          src={model.image}
          alt={t.modelDetail.imageAlt(model.code, model.color)}
          className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="font-display text-base font-semibold text-ink tabular-nums">
          {model.code}
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span
            className="size-3 rounded-full ring-1 ring-ink/20"
            style={{ backgroundColor: model.hex }}
            aria-hidden="true"
          />
          {model.color}
        </span>
      </div>
    </Link>
  )
}
