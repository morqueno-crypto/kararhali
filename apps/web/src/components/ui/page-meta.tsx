import { siteConfig } from '@/config/site'
import { defaultLocale, locales, useAlternatePaths, useI18n } from '@/i18n'

interface PageMetaProps {
  title?: string
  description?: string
}

// React 19, <title>, <meta> ve <link> etiketlerini otomatik olarak <head> içine taşır.
export function PageMeta({ title, description }: PageMetaProps) {
  const { t } = useI18n()
  const alternates = useAlternatePaths()
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${t.meta.tagline}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? t.meta.description} />
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`${origin}${alternates[locale]}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${origin}${alternates[defaultLocale]}`} />
    </>
  )
}
