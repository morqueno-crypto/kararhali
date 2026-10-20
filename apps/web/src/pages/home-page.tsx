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
import { useSite } from '@/site'
import type { homeLoader } from './home-loader'

export function HomePage() {
  const { featured } = useLoaderData<typeof homeLoader>()
  const { path } = useI18n()
  const { content } = useSite()
  const story = content['home.story']
  const values = content['home.values']
  useScrollTriggerSync()

  return (
    <>
      <PageMeta />
      <HeroSection content={content['home.hero']} />

      {/* Hero pin'i sırasında rulo kapanırken rakamlar alttan yükselir (yalnızca hareket izni varken) */}
      <section className="relative z-20 py-16 motion-safe:-mt-[45dvh] sm:py-20">
        <Container>
          <StatGrid items={content['company.stats'].items} />
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <CategorySplit content={content['home.categories']} />
        </Container>
      </section>

      <FeaturedStrip collections={featured} />

      <section className="border-y border-line bg-surface py-20 sm:py-28 lg:py-0">
        <Container className="lg:pt-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow={story.eyebrow}
              title={story.title}
              titleAccent={story.titleAccent}
              description={story.text}
            />
            <ButtonLink
              to={path('production')}
              variant="secondary"
              className="self-start sm:self-auto"
            >
              {story.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
        <div className="mt-12 lg:mt-0">
          <ProductionStory steps={content['production.steps'].items} />
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={values.eyebrow}
            title={values.title}
            titleAccent={values.titleAccent}
          />
          <FeatureGrid items={content['company.values'].items} numbered className="mt-12" />
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
