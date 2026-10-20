import type { PublicContent } from '@karar-hali/shared'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { Reveal } from '@/components/ui/reveal'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useReducedMotion } from '@/lib/motion/use-media-query'
import { useTilt } from '@/lib/motion/pointer-effects'

/** Halı / rulo kesim ana gruplarına giriş kartları (kaydırmaya bağlı dikey parallax). */
export function CategorySplit({ content: labels }: { content: PublicContent['home.categories'] }) {
  const { t, path } = useI18n()
  const reduced = useReducedMotion()
  const scope = useRef<HTMLDivElement>(null)
  const tilt = useTilt<HTMLAnchorElement>(3)

  useGSAP(
    () => {
      if (reduced) return
      gsap.utils.toArray<HTMLElement>('[data-parallax-y]', scope.current).forEach((layer) => {
        gsap.fromTo(
          layer,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: layer, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope, dependencies: [reduced] },
  )

  const items = [
    {
      title: labels.carpetsTitle,
      text: labels.carpetsText,
      image: labels.carpetsImage,
      to: `${path('collections')}?category=carpet`,
    },
    {
      title: labels.rollsTitle,
      text: labels.rollsText,
      image: labels.rollsImage,
      to: `${path('collections')}?category=roll`,
    },
  ]

  return (
    <div ref={scope} className="grid gap-5 md:grid-cols-2">
      {items.map((item, index) => (
        <Reveal key={item.title} variant="up" delay={index * 120}>
          <Link
            to={item.to}
            data-cursor={t.common.explore}
            {...tilt}
            className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-3xl border border-line p-8 transition-[transform,border-color] duration-500 ease-(--ease-out-expo) hover:border-ink/25 sm:p-10"
          >
            <div data-parallax-y className="absolute inset-x-0 -inset-y-[10%] -z-20">
              <RemoteImage
                src={item.image}
                alt=""
                className="size-full object-cover transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-110"
              />
            </div>
            <div
              className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/60 to-transparent"
              aria-hidden="true"
            />
            <h3 className="text-3xl font-semibold text-ink sm:text-4xl">{item.title}</h3>
            <p className="mt-3 max-w-sm text-muted">{item.text}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              {labels.cta}
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
