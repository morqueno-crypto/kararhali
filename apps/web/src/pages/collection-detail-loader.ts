import type { LoaderFunctionArgs } from 'react-router'
import type { Locale } from '@/i18n'
import { getCollectionBySlug, getCollections } from '@/services/collections'

export async function collectionDetailLoader({ params }: LoaderFunctionArgs, locale: Locale) {
  const collection = params.slug ? await getCollectionBySlug(params.slug, locale) : undefined
  if (!collection) throw new Response('Not Found', { status: 404 })

  const others = (await getCollections(locale))
    .filter((c) => c.slug !== collection.slug && c.category === collection.category)
    .slice(0, 3)
  return { collection, others }
}
