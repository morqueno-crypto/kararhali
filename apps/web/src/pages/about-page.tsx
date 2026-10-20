import { CtaSection } from '@/components/layout/cta-section'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { FairGallery, FeatureGrid } from '@/features/company'
import { useI18n } from '@/i18n'
import { useSite } from '@/site'

export function AboutPage() {
  const { t } = useI18n()
  const { content } = useSite()
  const about = content['about.page']

  return (
    <>
      <PageMeta title={t.nav.about} description={about.description} />
      <PageHero
        eyebrow={about.eyebrow}
        title={about.title}
        titleAccent={about.titleAccent}
        description={about.description}
        image={{ src: about.image, alt: '' }}
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
          <StatGrid items={content['company.stats'].items} />
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={about.pillarsEyebrow} title={about.pillarsTitle} />
          <FeatureGrid
            items={content['company.pillars'].items}
            numbered
            columns={3}
            className="mt-12"
          />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={about.valuesEyebrow} title={about.valuesTitle} />
          <FeatureGrid items={content['company.values'].items} className="mt-12" />
        </Container>
      </section>

      {about.fairImages.length > 0 && (
        <section className="pb-8">
          <Container>
            <SectionHeading
              eyebrow={about.fairsEyebrow}
              title={about.fairsTitle}
              description={about.fairsText}
            />
            <div className="mt-12">
              <FairGallery images={about.fairImages} />
            </div>
          </Container>
        </section>
      )}

      <CtaSection />
    </>
  )
}
