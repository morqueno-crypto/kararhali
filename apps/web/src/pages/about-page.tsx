import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { FairGallery, FeatureGrid } from '@/features/company'
import { CtaSection } from '@/features/home'
import { useI18n } from '@/i18n'
import type { aboutLoader } from './about-loader'

export function AboutPage() {
  const { stats, pillars, values, images } = useLoaderData<typeof aboutLoader>()
  const { t } = useI18n()
  const { about } = t

  return (
    <>
      <PageMeta title={t.nav.about} description={about.metaDescription} />
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        description={about.description}
        image={{ src: images.catalogs, alt: '' }}
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={about.storyEyebrow} title={about.storyTitle} />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-muted lg:col-span-7">
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
        <Container className="mt-16">
          <StatGrid items={stats} />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={about.pillarsEyebrow} title={about.pillarsTitle} />
          <FeatureGrid items={pillars} numbered columns={3} className="mt-12" />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={about.valuesEyebrow} title={about.valuesTitle} />
          <FeatureGrid items={values} className="mt-12" />
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <SectionHeading
            eyebrow={about.fairsEyebrow}
            title={about.fairsTitle}
            description={about.fairsText}
          />
          <div className="mt-12">
            <FairGallery images={images.fairs} />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
