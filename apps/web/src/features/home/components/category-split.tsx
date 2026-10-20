import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'

interface CategorySplitProps {
  images: { carpets: string; rolls: string }
}

/** Halı / rulo kesim ana gruplarına giriş kartları. */
export function CategorySplit({ images }: CategorySplitProps) {
  const { t, path } = useI18n()
  const labels = t.home.categories
  const items = [
    {
      title: labels.carpetsTitle,
      text: labels.carpetsText,
      image: images.carpets,
      to: `${path('collections')}?category=carpet`,
    },
    {
      title: labels.rollsTitle,
      text: labels.rollsText,
      image: images.rolls,
      to: `${path('collections')}?category=roll`,
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.to}
          className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-3xl border border-line p-8 sm:p-10"
        >
          <RemoteImage
            src={item.image}
            alt=""
            className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/60 to-transparent"
            aria-hidden="true"
          />
          <h3 className="text-3xl font-semibold text-ink sm:text-4xl">{item.title}</h3>
          <p className="mt-3 max-w-sm text-muted">{item.text}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            {labels.cta}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </Link>
      ))}
    </div>
  )
}
