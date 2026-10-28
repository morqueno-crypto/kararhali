import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ViewTransition } from 'react'
import { Link, useLoaderData } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { RemoteImage } from '@/components/ui/remote-image'
import { SectionHeading } from '@/components/ui/section-heading'
import {
  CollectionCard,
  collectionImageTransition,
  ModelCard,
  SizeList,
} from '@/features/collections'
import { useI18n } from '@/i18n'
import type { collectionDetailLoader } from './collection-detail-loader'

export function CollectionDetailPage() {
  const { collection, others } = useLoaderData<typeof collectionDetailLoader>()
  const { t, path } = useI18n()
  const labels = t.collectionDetail
  const category = t.collections.categories[collection.category]

  return (
    <>
      <PageMeta title={collection.name} description={collection.description} />

      <section className="relative isolate overflow-hidden border-b border-line">
        {/* Listedeki kart görseli buraya büyüyerek gelir (shared element) */}
        <ViewTransition name={collectionImageTransition(collection.slug)} share="morph">
          <div className="absolute inset-0 -z-20 overflow-hidden">
            <RemoteImage
              src={collection.cover}
              alt={collection.name}
              loading="eager"
              fetchPriority="high"
              className="size-full object-cover motion-safe:animate-ken-burns"
            />
          </div>
        </ViewTransition>
        <div
          className="absolute inset-0 -z-10 bg-linear-to-t from-canvas via-canvas/75 to-canvas/30"
          aria-hidden="true"
        />
        <Container className="flex min-h-[32rem] flex-col justify-between py-10 sm:min-h-[38rem]">
          <Link
            to={path('collections')}
            className="inline-flex items-center gap-2 self-start rounded-full border border-ink/20 bg-canvas/40 px-4 py-2 text-sm font-medium text-ink backdrop-blur hover:border-ink/40"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {labels.back}
          </Link>
          <div className="grid gap-8 pt-24 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">
                {labels.eyebrow(category)}
              </p>
              <h1 className="mt-4 text-6xl font-semibold text-ink sm:text-8xl">
                {collection.name}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {collection.description}
              </p>
            </div>
            <div className="space-y-4 lg:col-span-5 lg:justify-self-end">
              <h2 className="font-sans text-xs font-medium tracking-[0.25em] text-subtle uppercase">
                {labels.sizes}
              </h2>
              <SizeList sizes={collection.sizes} />
              {collection.category === 'roll' && (
                <p className="text-sm text-subtle">{labels.rollNote}</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading title={labels.models} description={labels.modelsDescription} />
            <ButtonLink to={path('contact')} className="self-start sm:self-auto">
              {labels.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {collection.models.map((model) => (
              <ModelCard key={model.slug} model={model} />
            ))}
          </div>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line py-16 sm:py-24">
          <Container>
            <SectionHeading eyebrow={labels.othersEyebrow} title={labels.othersTitle} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <CollectionCard key={other.slug} collection={other} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
