import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'

export function HeroSection({ image }: { image: string }) {
  const { t, path } = useI18n()
  const { hero } = t.home

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-4.5rem)] items-end overflow-hidden">
      <RemoteImage
        src={image}
        alt={hero.imageAlt}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/70 to-canvas/10"
        aria-hidden="true"
      />
      <Container className="pt-32 pb-16 sm:pb-24">
        <p className="text-xs font-medium tracking-[0.3em] text-accent uppercase">{hero.eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-6xl leading-[0.95] font-semibold text-ink sm:text-8xl lg:text-9xl">
          {hero.title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{hero.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to={path('collections')}>
            {hero.primary} <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to={path('about')} variant="secondary" className="bg-canvas/40 backdrop-blur">
            {hero.secondary}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
