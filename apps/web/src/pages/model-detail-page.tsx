import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import { ViewTransition } from 'react'
import { Link, useLoaderData } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { RemoteImage } from '@/components/ui/remote-image'
import { Reveal } from '@/components/ui/reveal'
import { ImageZoom, ModelCard, modelImageTransition, SizeList } from '@/features/collections'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import type { modelDetailLoader } from './model-detail-loader'

export function ModelDetailPage() {
  const { collection, model, variants, related } = useLoaderData<typeof modelDetailLoader>()
  const { t, path } = useI18n()
  const labels = t.modelDetail
  const title = `${collection.name} ${model.code}`

  const specs = [
    { label: labels.code, value: model.code },
    { label: labels.color, value: model.color, hex: model.hex },
    { label: labels.collection, value: collection.name },
    { label: labels.category, value: t.collections.categories[collection.category] },
  ]

  return (
    <>
      <PageMeta title={`${title} · ${model.color}`} description={collection.description} />

      <section className="py-10 sm:py-14">
        <Container>
          <Link
            to={path('collectionDetail', { slug: collection.slug })}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-muted hover:border-ink/40 hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {labels.back(collection.name)}
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="mx-auto max-w-md lg:sticky lg:top-28 lg:max-w-none">
                {/*
                 * Paylaşılan öğe: koleksiyondaki model kartı ya da renk seçeneği küçük görseli buraya büyür.
                 * key ile renk değişiminde yeniden takılır; böylece eski ana görsel de küçük görsele döner.
                 */}
                <ViewTransition
                  key={model.slug}
                  name={modelImageTransition(collection.slug, model.slug)}
                  share="morph"
                  default="none"
                >
                  <div>
                    <ImageZoom src={model.image} alt={labels.imageAlt(model.code, model.color)} />
                  </div>
                </ViewTransition>
                <p className="mt-3 text-center text-xs text-subtle">{labels.zoomHint}</p>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pt-6">
              <Reveal
                as="p"
                variant="tracking"
                className="text-xs font-medium tracking-[0.25em] text-accent uppercase"
              >
                {labels.eyebrow(collection.name)}
              </Reveal>
              <h1 className="mt-4 overflow-hidden text-5xl font-semibold text-ink tabular-nums sm:text-7xl">
                <Reveal as="span" variant="mask" className="block">
                  {model.code}
                </Reveal>
              </h1>
              <p className="mt-3 text-xl text-muted">{model.color}</p>
              <p className="mt-6 max-w-lg leading-relaxed text-muted">{collection.description}</p>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-surface p-5">
                    <dt className="text-xs text-subtle">{spec.label}</dt>
                    <dd className="mt-1.5 flex items-center gap-2 font-medium text-ink">
                      {spec.hex && (
                        <span
                          className="size-3.5 rounded-full ring-1 ring-ink/20"
                          style={{ backgroundColor: spec.hex }}
                          aria-hidden="true"
                        />
                      )}
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h2 className="mt-10 font-sans text-xs font-medium tracking-[0.25em] text-subtle uppercase">
                {labels.sizes}
              </h2>
              <div className="mt-4">
                <SizeList sizes={collection.sizes} />
              </div>

              {variants.length > 1 && (
                <>
                  <h2 className="mt-10 font-sans text-xs font-medium tracking-[0.25em] text-subtle uppercase">
                    {labels.variants}
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {variants.map((variant) => (
                      // Seçili olma durumu değişince yeniden takılır (paylaşılan öğe eşleşmesi için)
                      <li key={`${variant.slug}-${variant.slug === model.slug}`}>
                        <Link
                          to={path('modelDetail', { slug: collection.slug, model: variant.slug })}
                          aria-current={variant.slug === model.slug ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5 text-sm transition-colors',
                            variant.slug === model.slug
                              ? 'border-accent text-ink'
                              : 'border-line text-muted hover:border-ink/40 hover:text-ink',
                          )}
                        >
                          {variant.slug === model.slug ? (
                            <VariantThumb image={variant.image} />
                          ) : (
                            <ViewTransition
                              name={modelImageTransition(collection.slug, variant.slug)}
                              share="morph"
                              default="none"
                            >
                              <VariantThumb image={variant.image} />
                            </ViewTransition>
                          )}
                          {variant.color}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <ButtonLink to={path('contact')} className="mt-10">
                {labels.cta} <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
              <p className="mt-6 flex items-start gap-2 text-xs text-subtle">
                <Info className="size-4 shrink-0" aria-hidden="true" /> {labels.note}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line py-16 sm:py-24">
          <Container>
            <h2 className="text-3xl font-semibold text-ink sm:text-4xl">{labels.related}</h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <ModelCard key={item.slug} model={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}

function VariantThumb({ image }: { image: string }) {
  return (
    <span className="size-9 overflow-hidden rounded-full bg-paper">
      <RemoteImage src={image} alt="" className="size-full object-cover" />
    </span>
  )
}
