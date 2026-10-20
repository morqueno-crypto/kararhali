import { Link } from 'react-router'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { useTilt } from '@/lib/motion/pointer-effects'
import type { ProductModel } from '@/types/collection'

interface ModelCardProps {
  model: ProductModel
  active?: boolean
}

export function ModelCard({ model, active }: ModelCardProps) {
  const { t, path } = useI18n()
  const tilt = useTilt<HTMLAnchorElement>(3)

  return (
    <Link
      to={path('modelDetail', { slug: model.collectionSlug, model: model.slug })}
      aria-current={active ? 'page' : undefined}
      data-cursor={t.common.explore}
      {...tilt}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-surface transition-[transform,border-color] duration-500 ease-(--ease-out-expo) will-change-transform',
        active ? 'border-accent' : 'border-line hover:border-ink/30',
      )}
    >
      <div className="aspect-11/16 overflow-hidden bg-paper p-4">
        <RemoteImage
          src={model.image}
          alt={t.modelDetail.imageAlt(model.code, model.color)}
          className="size-full object-contain transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="font-display text-base font-semibold text-ink tabular-nums transition-colors group-hover:text-accent">
          {model.code}
        </span>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span
            className="size-3 rounded-full ring-1 ring-ink/20 transition-transform duration-300 group-hover:scale-125"
            style={{ backgroundColor: model.hex }}
            aria-hidden="true"
          />
          {model.color}
        </span>
      </div>
      <span
        aria-hidden="true"
        className="absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-x-100"
      />
    </Link>
  )
}
