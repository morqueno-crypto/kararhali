import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { useI18n } from '@/i18n'

export function NotFoundPage() {
  const { t, path } = useI18n()

  return (
    <>
      <PageMeta title={t.notFound.metaTitle} />
      <Container className="flex flex-col items-start py-28 sm:py-36">
        <p className="font-display text-7xl font-medium text-madder-600">404</p>
        <h1 className="mt-4 text-3xl font-medium text-ink-950 sm:text-4xl">{t.notFound.title}</h1>
        <p className="mt-4 max-w-md text-lg text-ink-700">{t.notFound.text}</p>
        <ButtonLink to={path('home')} className="mt-8">
          {t.common.backHome}
        </ButtonLink>
      </Container>
    </>
  )
}
