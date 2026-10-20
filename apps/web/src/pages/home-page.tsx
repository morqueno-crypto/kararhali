import { ArrowRight } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { CtaSection } from '@/components/layout/cta-section'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { FeatureGrid } from '@/features/company'
import { CategorySplit, FeaturedStrip, HeroSection } from '@/features/home'
import { ProductionStory } from '@/features/production'
import { useI18n } from '@/i18n'
import { useScrollTriggerSync } from '@/lib/motion/use-scroll-trigger-sync'
import type { homeLoader } from './home-loader'

export function HomePage() {
  const { featured, company, steps } = useLoaderData<typeof homeLoader>()
  const { t, path } = useI18n()
  const { home } = t
  useScrollTriggerSync()

  return (
    <>
      <PageMeta />
      <HeroSection image={company.images.hero} />

      {/* Hero pin'i sırasında rulo kapanırken rakamlar alttan yükselir (yalnızca hareket izni varken) */}
      <section className="relative z-20 py-16 motion-safe:-mt-[45dvh] sm:py-20">
        <Container>
          <StatGrid items={company.stats} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <CategorySplit images={company.images} />
        </Container>
      </section>

      <FeaturedStrip collections={featured} />

      <section className="border-y border-line bg-surface py-20 sm:py-28 lg:py-0">
        <Container className="lg:pt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={home.story.eyebrow}
              title={home.story.title}
              titleAccent={home.story.titleAccent}
              description={home.story.text}
            />
            <ButtonLink
              to={path('production')}
              variant="secondary"
              className="self-start sm:self-auto"
            >
              {home.story.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
        <div className="mt-12 lg:mt-0">
          <ProductionStory steps={steps} />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={home.values.eyebrow}
            title={home.values.title}
            titleAccent={home.values.titleAccent}
          />
          <FeatureGrid items={company.values} numbered className="mt-12" />
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
