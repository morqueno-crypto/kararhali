import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { PageMeta } from '@/components/ui/page-meta'
import { useI18n } from '@/i18n'

export function NotFoundPage() {
  const { t, path } = useI18n()

  return (
    <>
      <PageMeta title={t.notFound.metaTitle} />
      <Container className="flex flex-col items-start py-28 sm:py-40">
        <p className="font-display text-8xl font-semibold text-accent sm:text-9xl">404</p>
        <h1 className="mt-6 text-3xl font-semibold text-ink sm:text-5xl">{t.notFound.title}</h1>
        <p className="mt-4 max-w-md text-lg text-muted">{t.notFound.text}</p>
        <ButtonLink to={path('home')} className="mt-10">
          {t.common.backHome}
        </ButtonLink>
      </Container>
    </>
  )
}
