import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { Milestones, ValuesGrid } from '@/features/company'
import { CtaSection } from '@/features/home'
import { useI18n } from '@/i18n'
import type { aboutLoader } from './about-loader'

export function AboutPage() {
  const { stats, values, milestones } = useLoaderData<typeof aboutLoader>()
  const { t } = useI18n()
  const { about } = t

  return (
    <>
      <PageMeta title={t.nav.about} description={about.metaDescription} />
      <PageHero eyebrow={about.eyebrow} title={about.title} description={about.description} />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={about.storyEyebrow} title={about.storyTitle} />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
              {about.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={about.milestonesEyebrow} title={about.milestonesTitle} />
            <div className="mt-8">
              <Milestones items={milestones} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-ink-900/10 bg-cream-100 py-14">
        <Container>
          <StatGrid items={stats} />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={about.valuesEyebrow} title={about.valuesTitle} />
          <div className="mt-12">
            <ValuesGrid values={values} />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
