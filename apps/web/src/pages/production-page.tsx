import { BadgeCheck } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { CtaSection } from '@/features/home'
import { ProcessSteps } from '@/features/production'
import type { productionLoader } from './production-loader'

export function ProductionPage() {
  const { steps, highlights, certifications } = useLoaderData<typeof productionLoader>()

  return (
    <>
      <PageMeta
        title="Üretim"
        description="Entegre halı üretim tesisimiz, altı aşamalı üretim sürecimiz ve sertifikalarımız."
      />
      <PageHero
        eyebrow="Üretim"
        title="Entegre tesis, kontrollü süreç."
        description="İplik boyamadan paketlemeye kadar her adım, Gaziantep Organize Sanayi Bölgesi’ndeki tesisimizde kendi ekiplerimizce yürütülür."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Süreç"
            title="Altı adımda bir halının yolculuğu"
            description="Her aşamada ölçülebilir kalite kriterleri uygulanır; ürünler bir sonraki aşamaya ancak bu kontrollerden geçtikten sonra ilerler."
          />
          <ProcessSteps steps={steps} className="mt-12" />
        </Container>
      </section>

      <section className="bg-ink-950 py-20 sm:py-24">
        <Container>
          <SectionHeading tone="light" eyebrow="Tesis" title="Rakamlarla üretim gücümüz" />
          <StatGrid items={highlights} tone="light" className="mt-12" />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Kalite ve sürdürülebilirlik"
            title="Sertifikalarımız"
            description="Uluslararası standartlara uygun üretim yapıyor, süreçlerimizi düzenli olarak bağımsız kuruluşlara denetletiyoruz."
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
