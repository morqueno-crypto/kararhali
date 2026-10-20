import { ArrowRight } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { CollectionCard } from '@/features/collections'
import { ValuesGrid } from '@/features/company'
import { CtaSection, HeroSection } from '@/features/home'
import { ProcessSteps } from '@/features/production'
import { useI18n } from '@/i18n'
import type { homeLoader } from './home-loader'

export function HomePage() {
  const { featured, company, production } = useLoaderData<typeof homeLoader>()
  const { t, path } = useI18n()
  const { home } = t

  return (
    <>
      <PageMeta />
      <HeroSection showcase={featured} />

      <section className="border-y border-ink-900/10 bg-cream-50 py-14">
        <Container>
          <StatGrid items={company.stats} />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={home.collections.eyebrow}
              title={home.collections.title}
              description={home.collections.description}
            />
            <ButtonLink
              to={path('collections')}
              variant="secondary"
              className="self-start sm:self-auto"
            >
              {home.collections.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-indigo-800 py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              tone="light"
              eyebrow={home.production.eyebrow}
              title={home.production.title}
              description={home.production.description}
            />
            <ButtonLink to={path('production')} variant="light" className="self-start sm:self-auto">
              {home.production.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ProcessSteps steps={production.steps} tone="light" className="mt-12" />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={home.values.eyebrow} title={home.values.title} align="center" />
          <div className="mt-12">
            <ValuesGrid values={company.values} />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
