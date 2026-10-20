import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/i18n'

const CURRENT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  const { t, path } = useI18n()
  const { contact, social } = siteConfig

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t.meta.description}</p>
          <p className="mt-6 text-xs font-medium tracking-[0.25em] text-subtle uppercase">
            {t.footer.follow}
          </p>
          <ul className="mt-3 flex gap-3">
            {[
              { label: 'Instagram', href: social.instagram },
              { label: 'Facebook', href: social.facebook },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ink/40 hover:text-ink"
                >
                  {item.label} <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-sans text-xs font-medium tracking-[0.25em] text-subtle uppercase">
            {t.footer.pages}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {siteConfig.nav.map((page) => (
              <li key={page}>
                <Link to={path(page)} className="text-muted hover:text-ink">
                  {t.nav[page]}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.dealerLogin}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-ink"
              >
                {t.common.dealerLogin}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="font-sans text-xs font-medium tracking-[0.25em] text-subtle uppercase">
            {t.footer.contact}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              {t.contactInfo.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className="hover:text-ink">
                {contact.phoneLines}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-ink">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>
            © {CURRENT_YEAR} {siteConfig.name}. {t.footer.rights}
          </p>
          <p>{t.footer.demo}</p>
        </Container>
      </div>
    </footer>
  )
}
