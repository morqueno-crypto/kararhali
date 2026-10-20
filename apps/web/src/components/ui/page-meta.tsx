import { defaultLocale, locales, useAlternatePaths } from '@/i18n'
import { useSite } from '@/site'

interface PageMetaProps {
  title?: string
  description?: string
}

// React 19, <title>, <meta> ve <link> etiketlerini otomatik olarak <head> içine taşır.
export function PageMeta({ title, description }: PageMetaProps) {
  const { general } = useSite().settings
  const alternates = useAlternatePaths()
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  const fullTitle = title
    ? `${title} | ${general.siteName}`
    : `${general.siteName} — ${general.tagline}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description ?? general.description} />
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
