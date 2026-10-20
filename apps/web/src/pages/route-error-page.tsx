import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { useI18n } from '@/i18n'
import { NotFoundPage } from '@/pages/not-found-page'

export function RouteErrorPage() {
  const error = useRouteError()
  const { t, path } = useI18n()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  return (
    <Container className="py-28">
      <h1 className="text-3xl font-medium text-ink-950">{t.error.title}</h1>
      <p className="mt-4 text-ink-700">{t.error.text}</p>
      <ButtonLink to={path('home')} className="mt-8">
        {t.common.backHome}
      </ButtonLink>
    </Container>
  )
}
