import { siteConfig } from '@/config/site'

interface PageMetaProps {
  title?: string
  description?: string
}

// React 19, <title> ve <meta> etiketlerini otomatik olarak <head> içine taşır.
export function PageMeta({ title, description = siteConfig.description }: PageMetaProps) {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </>
  )
}
