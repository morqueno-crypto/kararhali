import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { NotFoundPage } from '@/pages/not-found-page'

export function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  return (
    <Container className="py-28">
      <h1 className="text-3xl font-medium text-ink-950">Bir şeyler ters gitti</h1>
      <p className="mt-4 text-ink-700">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      <ButtonLink to="/" className="mt-8">
        Ana sayfaya dön
      </ButtonLink>
    </Container>
  )
}
