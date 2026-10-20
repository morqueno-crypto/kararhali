import type { LoaderFunctionArgs } from 'react-router'
import { getCollectionBySlug, getCollections } from '@/services/collections'

export async function collectionDetailLoader({ params }: LoaderFunctionArgs) {
  const collection = params.slug ? await getCollectionBySlug(params.slug) : undefined
  if (!collection) throw new Response('Koleksiyon bulunamadı', { status: 404 })

  const others = (await getCollections()).filter((c) => c.slug !== collection.slug).slice(0, 3)
  return { collection, others }
}
