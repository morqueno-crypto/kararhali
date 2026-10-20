import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/i18n'

const CURRENT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  const { t, path } = useI18n()
  const { contact } = siteConfig

  return (
    <footer className="bg-ink-950 text-cream-200">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-xl font-semibold text-cream-50">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-300">
            {t.meta.description}
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-sans text-sm font-semibold tracking-wider text-cream-50 uppercase">
            {t.footer.pages}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {siteConfig.nav.map((page) => (
              <li key={page}>
                <Link to={path(page)} className="hover:text-cream-50">
                  {t.nav[page]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="font-sans text-sm font-semibold tracking-wider text-cream-50 uppercase">
            {t.footer.contact}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-madder-400" aria-hidden="true" />
              {t.contactInfo.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-madder-400" aria-hidden="true" />
              <a
                href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                className="hover:text-cream-50"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-madder-400" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-cream-50">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-cream-50/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-cream-300 sm:flex-row sm:justify-between">
          <p>
            © {CURRENT_YEAR} {siteConfig.name}. {t.footer.rights}
          </p>
          <p>{t.footer.demo}</p>
        </Container>
      </div>
    </footer>
  )
}
