import { useLoaderData } from 'react-router'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { CollectionBrowser } from '@/features/collections'
import { useI18n } from '@/i18n'
import { useContent } from '@/site'
import type { collectionsLoader } from './collections-loader'

export function CollectionsPage() {
  const { collections } = useLoaderData<typeof collectionsLoader>()
  const { t } = useI18n()
  const page = useContent('collections.page')

  return (
    <>
      <PageMeta title={t.nav.collections} description={page.description} />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        titleAccent={page.titleAccent}
        description={page.description}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <CollectionBrowser collections={collections} />
        </Container>
      </section>
    </>
  )
}
