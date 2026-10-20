import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section-heading'
import { CollectionCard } from '@/features/collections'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { DESKTOP_MOTION_QUERY } from '@/lib/motion/constants'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useMediaQuery } from '@/lib/motion/use-media-query'
import { useContent } from '@/site'
import type { Collection } from '@/types/collection'

/**
 * Öne çıkan koleksiyonlar. Masaüstünde bölüm sabitlenir ve dikey kaydırma yatay harekete dönüşür;
 * kart görselleri ters yönde hafif parallax yapar. Mobilde / reduced-motion'da yatay kaydırılan (snap) liste.
 */
export function FeaturedStrip({ collections }: { collections: Collection[] }) {
  const { path } = useI18n()
  const featured = useContent('home.featured')
  const animated = useMediaQuery(DESKTOP_MOTION_QUERY)
  const scope = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!animated || !track.current) return
      const header = document.querySelector('header')
      const distance = () =>
        Math.max(0, (track.current?.scrollWidth ?? 0) - document.documentElement.clientWidth)

      const horizontal = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: () => `top ${header?.offsetHeight ?? 0}px`,
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]', track.current).forEach((layer) => {
        gsap.fromTo(
          layer,
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: layer,
              containerAnimation: horizontal,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    },
    { scope, dependencies: [animated, collections.length] },
  )

  return (
    <section
      ref={scope}
      className={cn(
        'overflow-hidden',
        animated ? 'flex h-[calc(100dvh-4.5rem)] flex-col justify-center' : 'pb-20 sm:pb-28',
      )}
    >
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow={featured.eyebrow}
          title={featured.title}
          titleAccent={featured.titleAccent}
          description={featured.description}
        />
        <ButtonLink
          to={path('collections')}
          variant="secondary"
          className="self-start sm:self-auto"
        >
          {featured.cta} <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </Container>

      <div
        ref={track}
        className={cn(
          'mt-12 flex gap-5 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]',
          animated
            ? 'w-max will-change-transform'
            : 'snap-x snap-mandatory [scrollbar-width:thin] overflow-x-auto pb-4',
        )}
      >
        {collections.map((collection) => (
          <CollectionCard
            key={collection.slug}
            collection={collection}
            className={cn(
              'shrink-0 snap-start',
              animated ? 'w-[26rem] xl:w-[30rem]' : 'w-[78%] sm:w-[22rem]',
            )}
          />
        ))}
      </div>
    </section>
  )
}
