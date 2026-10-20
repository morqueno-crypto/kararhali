import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

export function FairGallery({ images }: { images: readonly string[] }) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            'overflow-hidden rounded-2xl border border-line bg-surface',
            index === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-4/3',
          )}
        >
          <RemoteImage
            src={src}
            alt={t.about.fairAlt(index + 1)}
            className="size-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}
