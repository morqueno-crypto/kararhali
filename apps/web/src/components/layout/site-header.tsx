import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Logo } from '@/components/ui/logo'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/10 bg-cream-50/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-3"
          aria-label={`${siteConfig.name} ana sayfa`}
        >
          <Logo />
          <span className="font-display text-xl font-semibold text-ink-950">{siteConfig.name}</span>
        </Link>

        <nav aria-label="Ana menü" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium transition-colors hover:text-madder-600',
                  isActive ? 'text-madder-600' : 'text-ink-700',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <ButtonLink to="/iletisim" className="px-5 py-2.5">
            Teklif Alın
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full text-ink-900 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobil menü"
          className="border-t border-ink-900/10 md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-3 text-base font-medium',
                    isActive ? 'bg-cream-200 text-madder-600' : 'text-ink-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <ButtonLink to="/iletisim" onClick={close} className="mt-2">
              Teklif Alın
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  )
}
