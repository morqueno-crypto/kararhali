import { CtaSection } from '@/components/layout/cta-section'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { RemoteImage } from '@/components/ui/remote-image'
import { SectionHeading } from '@/components/ui/section-heading'
import { FeatureGrid } from '@/features/company'
import { useI18n } from '@/i18n'
import { useSite } from '@/site'

export function ProductionPage() {
  const { t } = useI18n()
  const { content } = useSite()
  const production = content['production.page']
  const categories = content['home.categories']

  const types = [
    {
      title: categories.carpetsTitle,
      text: production.carpetsText,
      image: production.carpetsImage,
    },
    { title: categories.rollsTitle, text: production.rollsText, image: production.rollsImage },
  ]

  return (
    <>
      <PageMeta title={t.nav.production} description={production.description} />
      <PageHero
        eyebrow={production.eyebrow}
        title={production.title}
        titleAccent={production.titleAccent}
        description={production.description}
        image={{ src: production.image, alt: '' }}
      />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow={production.processEyebrow}
            title={production.processTitle}
            description={production.processDescription}
          />
          <FeatureGrid
            items={content['production.steps'].items}
            numbered
            columns={3}
            className="mt-12"
          />
        </Container>
      </section>

      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={production.typesEyebrow} title={production.typesTitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {types.map((type) => (
              <article
                key={type.title}
                className="overflow-hidden rounded-3xl border border-line bg-surface"
              >
                <div className="aspect-16/9 overflow-hidden">
                  <RemoteImage src={type.image} alt="" className="size-full object-cover" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-ink">{type.title}</h3>
                  <p className="mt-3 text-muted">{type.text}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  )
}
