import { BadgeCheck } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { CtaSection } from '@/features/home'
import { ProcessSteps } from '@/features/production'
import { useI18n } from '@/i18n'
import type { productionLoader } from './production-loader'

export function ProductionPage() {
  const { steps, highlights, certifications } = useLoaderData<typeof productionLoader>()
  const { t } = useI18n()
  const { production } = t

  return (
    <>
      <PageMeta title={t.nav.production} description={production.metaDescription} />
      <PageHero
        eyebrow={production.eyebrow}
        title={production.title}
        description={production.description}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={production.processEyebrow}
            title={production.processTitle}
            description={production.processDescription}
          />
          <ProcessSteps steps={steps} className="mt-12" />
        </Container>
      </section>

      <section className="bg-ink-950 py-20 sm:py-24">
        <Container>
          <SectionHeading
            tone="light"
            eyebrow={production.facilityEyebrow}
            title={production.facilityTitle}
          />
          <StatGrid items={highlights} tone="light" className="mt-12" />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={production.certEyebrow}
            title={production.certTitle}
            description={production.certDescription}
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {certifications.map((certification) => (
              <li
                key={certification}
                className="flex items-start gap-3 rounded-2xl bg-cream-100 p-6 ring-1 ring-ink-900/5"
              >
                <BadgeCheck className="size-6 shrink-0 text-madder-600" aria-hidden="true" />
                <span className="font-medium text-ink-900">{certification}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
