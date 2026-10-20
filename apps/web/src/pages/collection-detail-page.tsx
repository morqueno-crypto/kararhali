import { ArrowLeft, Check } from 'lucide-react'
import { Link, useLoaderData } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { SectionHeading } from '@/components/ui/section-heading'
import { CarpetSwatch, CollectionCard } from '@/features/collections'
import { useI18n } from '@/i18n'
import type { collectionDetailLoader } from './collection-detail-loader'

export function CollectionDetailPage() {
  const { collection, others } = useLoaderData<typeof collectionDetailLoader>()
  const { t, path } = useI18n()
  const labels = t.collectionDetail
  const category = t.collections.categories[collection.category]

  const specs = [
    { label: labels.specs.category, value: category },
    { label: labels.specs.material, value: collection.material },
    { label: labels.specs.pileHeight, value: collection.pileHeight },
    { label: labels.specs.technique, value: collection.technique },
  ]

  return (
    <>
      <PageMeta title={collection.name} description={collection.summary} />

      <section className="bg-cream-100">
        <Container className="py-10">
          <Link
            to={path('collections')}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-madder-600"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {labels.back}
          </Link>
        </Container>
        <Container className="grid items-center gap-12 pb-20 lg:grid-cols-2">
          <div className="flex justify-center rounded-3xl bg-cream-200 p-10 sm:p-16">
            <CarpetSwatch
              pattern={collection.pattern}
              palette={collection.palette}
              title={labels.swatchTitle(collection.name)}
              className="max-w-xs"
            />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-madder-600 uppercase">
              {labels.collectionOf(category)}
            </p>
            <h1 className="mt-3 text-4xl font-medium text-ink-950 sm:text-5xl">
              {collection.name}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-700">{collection.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink-900/10">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-cream-50 p-4">
                  <dt className="text-xs text-ink-500">{spec.label}</dt>
                  <dd className="mt-1 font-medium text-ink-950">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 font-sans text-sm font-semibold text-ink-900">{labels.sizes}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {collection.sizes.map((size) => (
                <li
                  key={size}
                  className="rounded-full bg-cream-50 px-3 py-1.5 text-sm text-ink-700 ring-1 ring-ink-900/10"
                >
                  {size}
                </li>
              ))}
            </ul>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {collection.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-ink-700">
                  <Check className="size-4 text-madder-600" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <ButtonLink to={path('contact')} className="mt-10">
              {labels.cta}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow={labels.othersEyebrow} title={labels.othersTitle} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => (
              <CollectionCard key={other.slug} collection={other} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
