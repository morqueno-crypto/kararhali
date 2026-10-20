import type { ReactNode } from 'react'
import { Container } from '@/components/ui/container'
import { RemoteImage } from '@/components/ui/remote-image'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  image?: { src: string; alt: string }
  children?: ReactNode
}

export function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      {image && (
        <>
          <RemoteImage
            src={image.src}
            alt={image.alt}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          <div
            className="absolute inset-0 -z-10 bg-linear-to-r from-canvas via-canvas/85 to-canvas/40"
            aria-hidden="true"
          />
        </>
      )}
      <Container className="py-20 sm:py-28">
        <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-ink sm:text-6xl">{title}</h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        )}
        {children}
      </Container>
    </section>
  )
}
