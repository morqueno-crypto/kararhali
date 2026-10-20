import type { ReactNode } from 'react'
import { Container } from '@/components/ui/container'
import { Emphasis } from '@/components/ui/emphasis'
import { RemoteImage } from '@/components/ui/remote-image'
import { Reveal } from '@/components/ui/reveal'

interface PageHeroProps {
  eyebrow: string
  title: string
  /** Başlık içinde vurgulanacak parça (i18n'den). */
  titleAccent?: string
  description?: ReactNode
  image?: { src: string; alt: string }
  children?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  titleAccent,
  description,
  image,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {image && (
        <>
          <Reveal variant="fade" className="absolute inset-0 -z-20">
            <RemoteImage
              src={image.src}
              alt={image.alt}
              loading="eager"
              fetchPriority="high"
              className="size-full object-cover"
            />
          </Reveal>
          <div
            className="absolute inset-0 -z-10 bg-linear-to-r from-canvas via-canvas/85 to-canvas/40"
            aria-hidden="true"
          />
        </>
      )}
      <Container className="py-20 sm:py-28">
        <Reveal
          as="p"
          variant="tracking"
          className="text-xs font-medium tracking-[0.25em] text-accent uppercase"
        >
          {eyebrow}
        </Reveal>
        <h1 className="mt-5 max-w-3xl overflow-hidden pb-[0.12em] text-4xl font-semibold text-ink sm:text-6xl">
          <Reveal as="span" variant="mask" className="block">
            <Emphasis text={title} accent={titleAccent} />
          </Reveal>
        </h1>
        {description && (
          <Reveal
            as="p"
            variant="up"
            delay={150}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {description}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  )
}
