import { ArrowRight } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { RemoteImage } from '@/components/ui/remote-image'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { CollectionCard } from '@/features/collections'
import { FeatureGrid } from '@/features/company'
import { CategorySplit, CtaSection, HeroSection } from '@/features/home'
import { useI18n } from '@/i18n'
import type { homeLoader } from './home-loader'

export function HomePage() {
  const { featured, company } = useLoaderData<typeof homeLoader>()
  const { t, path } = useI18n()
  const { home } = t

  return (
    <>
      <PageMeta />
      <HeroSection image={company.images.hero} />

      <section className="py-16 sm:py-20">
        <Container>
          <StatGrid items={company.stats} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <CategorySplit images={company.images} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={home.featured.eyebrow}
              title={home.featured.title}
              description={home.featured.description}
            />
            <ButtonLink
              to={path('collections')}
              variant="secondary"
              className="self-start sm:self-auto"
            >
              {home.featured.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="aspect-4/3 overflow-hidden rounded-3xl border border-line">
            <RemoteImage
              src={company.images.craft}
              alt={home.craft.imageAlt}
              className="size-full object-cover"
            />
          </div>
          <div>
            <SectionHeading eyebrow={home.craft.eyebrow} title={home.craft.title} />
            <p className="mt-6 text-lg leading-relaxed text-muted">{home.craft.text}</p>
            <ButtonLink to={path('production')} variant="secondary" className="mt-10">
              {home.craft.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={home.values.eyebrow} title={home.values.title} />
          <FeatureGrid items={company.values} numbered className="mt-12" />
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
