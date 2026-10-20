import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { CollectionBrowser } from '@/features/collections'
import type { collectionsLoader } from './collections-loader'

export function CollectionsPage() {
  const { collections } = useLoaderData<typeof collectionsLoader>()

  return (
    <>
      <PageMeta
        title="Koleksiyonlar"
        description="Klasik, modern, kilim ve dış mekân halı koleksiyonlarımızı keşfedin."
      />
      <PageHero
        eyebrow="Koleksiyonlar"
        title="Desen, doku ve renk zenginliği"
        description="Her koleksiyon kendi tasarım stüdyomuzda geliştirilir ve tesisimizde üretilir. Özel ölçü ve renk talepleri için bize ulaşın."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <CollectionBrowser collections={collections} />
        </Container>
      </section>
    </>
  )
}
