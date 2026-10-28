import { ArrowRight } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { CtaSection } from '@/components/layout/cta-section'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { FeatureGrid } from '@/features/company'
import { CategorySplit, FeaturedStrip, HeroSlider, MarqueeBand } from '@/features/home'
import { JourneyFinale, JourneyIntro, JourneyStory } from '@/features/journey'
import { useI18n } from '@/i18n'
import { useScrollTriggerSync } from '@/lib/motion/use-scroll-trigger-sync'
import { useSite } from '@/site'
import type { homeLoader } from './home-loader'

/** Hikâyeyi atla bağlantısının hedefi */
const FINALE_ID = 'evinizde'

/**
 * Ana sayfa bir halının yolculuğunu anlatır: giriş → kaydırmayla oynayan üretim hikâyesi
 * (ilk iplikten sevkiyata) → "ve sonunda evinizde" → mekân slaytları → koleksiyonlar ve firma.
 */
export function HomePage() {
  const { featured } = useLoaderData<typeof homeLoader>()
  const { path } = useI18n()
  const { content } = useSite()
  const journey = content['home.journey']
  const hero = content['home.hero']
  const story = content['home.story']
  const values = content['home.values']
  useScrollTriggerSync()

  return (
    <>
      <PageMeta />
      <JourneyIntro journey={journey} primaryCta={hero.primaryCta} skipTo={FINALE_ID} />
      <JourneyStory chapters={journey.chapters} />
      <JourneyFinale journey={journey} id={FINALE_ID} />

      <HeroSlider hero={hero} slides={content['home.slides'].items} />

      <MarqueeBand items={marqueeItems(featured.map((collection) => collection.name))} />

      <section className="relative isolate overflow-hidden py-16 sm:py-24">
        {/* Arka planda yavaşça süzülen sıcak ışık lekeleri */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-24 -z-10 size-96 rounded-full bg-accent/15 blur-3xl motion-safe:animate-float"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 -bottom-24 -z-10 size-96 rounded-full bg-accent-2/15 blur-3xl [animation-delay:-1.5s] motion-safe:animate-float"
        />
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

      {/* Üretimi daha yakından görmek isteyenler için */}
      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
        </Container>
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

/** Şeridin ekranı doldurup dikişsiz dönmesi için isim listesi en az 8 öğeye tamamlanır. */
function marqueeItems(names: string[]) {
  if (names.length === 0) return []
  let items = names
  while (items.length < 8) items = [...items, ...names]
  return items
}
