import type { LoaderFunctionArgs } from 'react-router'
import type { Locale } from '@/i18n'
import { getModelDetail } from '@/services/collections'

export async function modelDetailLoader({ params }: LoaderFunctionArgs, locale: Locale) {
  const detail =
    params.slug && params.model
      ? await getModelDetail(params.slug, params.model, locale)
      : undefined
  if (!detail) throw new Response('Not Found', { status: 404 })
  return detail
}
