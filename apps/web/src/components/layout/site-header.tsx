import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { LanguageSwitcher } from './language-switcher'

export function SiteHeader() {
  const { t, path } = useI18n()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/10 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link
          to={path('home')}
          onClick={close}
          className="flex items-center gap-3"
          aria-label={t.common.homeLink(siteConfig.name)}
        >
          <Logo />
          <span className="font-display text-xl font-semibold text-ink-950">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label={t.common.mainMenu} className="flex items-center gap-8">
            {siteConfig.nav.map((page) => (
              <NavLink
                key={page}
                to={path(page)}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-madder-600',
                    isActive ? 'text-madder-600' : 'text-ink-700',
                  )
                }
              >
                {t.nav[page]}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher />
          <ButtonLink to={path('contact')} className="px-5 py-2.5">
            {t.common.getQuote}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher onSelect={close} />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-ink-900"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t.common.mobileMenu}
          className="border-t border-ink-900/10 md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.nav.map((page) => (
              <NavLink
                key={page}
                to={path(page)}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-base font-medium',
                    isActive ? 'bg-cream-200 text-madder-600' : 'text-ink-900',
                  )
                }
              >
                {t.nav[page]}
              </NavLink>
            ))}
            <ButtonLink to={path('contact')} onClick={close} className="mt-2">
              {t.common.getQuote}
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  )
}
