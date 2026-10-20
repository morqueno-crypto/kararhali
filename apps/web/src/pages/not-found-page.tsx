import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Sayfa bulunamadı" />
      <Container className="flex flex-col items-start py-28 sm:py-36">
        <p className="font-display text-7xl font-medium text-madder-600">404</p>
        <h1 className="mt-4 text-3xl font-medium text-ink-950 sm:text-4xl">Sayfa bulunamadı</h1>
        <p className="mt-4 max-w-md text-lg text-ink-700">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.
        </p>
        <ButtonLink to="/" className="mt-8">
          Ana sayfaya dön
        </ButtonLink>
      </Container>
    </>
  )
}
