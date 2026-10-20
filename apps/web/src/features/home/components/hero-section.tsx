import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { CarpetSwatch } from '@/features/collections'
import { useI18n } from '@/i18n'
import type { Collection } from '@/types/collection'

export function HeroSection({ showcase }: { showcase: Collection[] }) {
  const { t, path } = useI18n()
  const { hero } = t.home
  const [first, second, third] = showcase

  return (
    <section className="relative overflow-hidden bg-cream-100">
      <Container className="grid items-center gap-16 py-16 sm:py-24 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-madder-600 uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 text-5xl leading-[1.05] font-medium text-ink-950 sm:text-6xl lg:text-7xl">
            {hero.titleStart} <em className="text-madder-600 not-italic">{hero.titleAccent}</em>{' '}
            {hero.titleEnd}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">{hero.text}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink to={path('collections')}>
              {hero.primary} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to={path('production')} variant="secondary">
              {hero.secondary}
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center sm:h-[520px]">
          <div
            className="absolute inset-8 rounded-full bg-madder-500/10 blur-3xl"
            aria-hidden="true"
          />
          {second && (
            <CarpetSwatch
              pattern={second.pattern}
              palette={second.palette}
              className="absolute top-6 left-0 w-40 -rotate-12 sm:w-48"
            />
          )}
          {third && (
            <CarpetSwatch
              pattern={third.pattern}
              palette={third.palette}
              className="absolute right-0 bottom-4 w-40 rotate-12 sm:w-48"
            />
          )}
          {first && (
            <CarpetSwatch
              pattern={first.pattern}
              palette={first.palette}
              title={hero.swatchTitle(first.name)}
              className="relative w-52 rotate-2 sm:w-64"
            />
          )}
        </div>
      </Container>
    </section>
  )
}
