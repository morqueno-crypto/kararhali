import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { StatGrid } from '@/components/ui/stat-grid'
import { Milestones, ValuesGrid } from '@/features/company'
import { CtaSection } from '@/features/home'
import type { aboutLoader } from './about-loader'

export function AboutPage() {
  const { stats, values, milestones } = useLoaderData<typeof aboutLoader>()

  return (
    <>
      <PageMeta
        title="Kurumsal"
        description="Lumen Halı'nın hikâyesi, değerleri ve 1987'den bugüne uzanan yolculuğu."
      />
      <PageHero
        eyebrow="Kurumsal"
        title="Üç kuşaklık dokuma bilgisi, modern bir fabrikada."
        description="12 tezgâhlı bir atölyeden 40’ı aşkın ülkeye ihracat yapan entegre bir üretim tesisine uzanan hikâyemiz."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Hikâyemiz" title="Zanaatı ölçeklendirmek" />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-700">
              <p>
                Lumen Halı, 1987 yılında Gaziantep’te küçük bir aile atölyesi olarak kuruldu. Bugün
                45.000 m² kapalı alanda, 450’yi aşkın çalışanıyla yılda 3,5 milyon m² halı üretiyor.
              </p>
              <p>
                Ustalarımızın deneyimini dijital desen laboratuvarımız ve yüksek hassasiyetli dokuma
                tezgâhlarımızla birleştiriyor; ev, otel, ofis ve perakende sektörlerine tutarlı
                kalitede ürün sunuyoruz.
              </p>
              <p>
                Üretimin her aşamasında enerji, su ve hammadde verimliliğini ölçüyor;
                sürdürülebilirliği iş yapış biçimimizin merkezine koyuyoruz.
              </p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Kilometre taşları" title="Yolculuğumuz" />
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
          <SectionHeading eyebrow="Değerlerimiz" title="Bizi biz yapan ilkeler" />
          <div className="mt-12">
            <ValuesGrid values={values} />
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
