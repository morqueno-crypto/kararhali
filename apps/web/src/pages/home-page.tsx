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
import type { homeLoader } from './home-loader'

export function HomePage() {
  const { featured, company, production } = useLoaderData<typeof homeLoader>()

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
              eyebrow="Koleksiyonlar"
              title="Her mekâna uygun bir dokuma"
              description="Klasik madalyonlardan minimalist düz dokumalara, kilimden dış mekân serilerine kadar geniş ürün yelpazesi."
            />
            <ButtonLink to="/koleksiyonlar" variant="secondary" className="self-start sm:self-auto">
              Tümünü görün <ArrowRight className="size-4" aria-hidden="true" />
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
              eyebrow="Üretim"
              title="İplikten sevkiyata, tek çatı altında"
              description="Altı aşamalı üretim sürecimizin her adımı kendi tesisimizde, kendi ekibimizle yürütülür."
            />
            <ButtonLink to="/uretim" variant="light" className="self-start sm:self-auto">
              Süreci inceleyin <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <ProcessSteps steps={production.steps} tone="light" className="mt-12" />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Değerlerimiz"
            title="Zanaatı geleceğe taşıyan ilkeler"
            align="center"
          />
          <div className="mt-12">
            <ValuesGrid values={company.values} />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
