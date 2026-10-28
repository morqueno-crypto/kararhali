import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { siteConfig } from '@/config/site'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { useSite } from '@/site'
import { LanguageSwitcher } from './language-switcher'

export function SiteHeader() {
  const { t, path } = useI18n()
  const site = useSite()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    // Sayfa geçişlerinde menü yerinde kalır (globals.css → site-header)
    <header
      style={{ viewTransitionName: 'site-header' }}
      className="sticky top-0 z-50 border-b border-line/60 bg-canvas/80 backdrop-blur-xl"
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link
          to={path('home')}
          onClick={close}
          aria-label={t.common.homeLink(site.settings.general.siteName)}
        >
          <Logo className="h-9 sm:h-10" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav aria-label={t.common.mainMenu} className="flex items-center gap-8">
            {siteConfig.nav.map((page) => (
              <NavLink
                key={page}
                to={path(page)}
                className={({ isActive }) =>
                  cn(
                    // Altta soldan sağa çizilen ince çizgi
                    'relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-500 after:ease-(--ease-out-expo) hover:text-ink hover:after:scale-x-100',
                    isActive ? 'text-ink after:scale-x-100' : 'text-muted after:scale-x-0',
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

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher onSelect={close} />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-ink/5"
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
          className="border-t border-line lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.nav.map((page) => (
              <NavLink
                key={page}
                to={path(page)}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-3 text-base font-medium',
                    isActive ? 'bg-raised text-ink' : 'text-muted',
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
