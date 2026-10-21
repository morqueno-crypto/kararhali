import type { PublicUser } from '@karar-hali/shared'
import { Bell, ExternalLink, LogOut, Menu, Plus, Search, UserCog } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { can, roleLabels } from '@/auth/permissions'
import { buttonClass } from '@/components/ui/button'
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from '@/components/ui/dropdown'
import { env } from '@/lib/env'
import { initials } from '@/lib/format'

interface TopbarProps {
  user: PublicUser
  newMessages: number
  onOpenMenu: () => void
  onLogout: () => void
}

/** Üst çubuk: koleksiyon arama, siteye git, bildirim, hızlı eylem ve kullanıcı menüsü. */
export function Topbar({ user, newMessages, onOpenMenu, onLogout }: TopbarProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function onSearch(event: FormEvent) {
    event.preventDefault()
    navigate(`/collections${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Menüyü aç"
        className="rounded-lg p-2 text-muted hover:bg-raised hover:text-ink lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {can(user, 'catalog') && (
        <form
          onSubmit={onSearch}
          role="search"
          className="relative hidden max-w-sm flex-1 sm:block"
        >
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Koleksiyon ara…"
            aria-label="Koleksiyon ara"
            className="h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
          />
        </form>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <a
          href={env.VITE_SITE_URL}
          target="_blank"
          rel="noreferrer"
          title="Siteyi yeni sekmede aç"
          aria-label="Siteyi yeni sekmede aç"
          className={buttonClass('ghost', 'icon')}
        >
          <ExternalLink />
        </a>
        {can(user, 'messages') && (
          <Link
            to="/messages"
            aria-label={`Mesajlar${newMessages ? `, ${newMessages} yeni` : ''}`}
            className={buttonClass('ghost', 'icon', 'relative')}
          >
            <Bell />
            {newMessages > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent ring-2 ring-canvas" />
            )}
          </Link>
        )}
        {can(user, 'catalog') && (
          <Link
            to="/collections/new"
            className={buttonClass('primary', 'md', 'ml-1 hidden sm:inline-flex')}
          >
            <Plus /> Yeni koleksiyon
          </Link>
        )}

        <Dropdown>
          <DropdownTrigger
            aria-label="Hesap menüsü"
            className="ml-1 flex items-center gap-2.5 rounded-xl py-1 pr-2 pl-1 hover:bg-raised"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
              {initials(user.name)}
            </span>
            <span className="hidden text-left leading-tight md:block">
              <span className="block text-xs font-semibold text-ink">{user.name}</span>
              <span className="block text-[11px] text-subtle">{roleLabels[user.role]}</span>
            </span>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onSelect={() => navigate('/profile')}>
              <UserCog /> Profilim
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem danger onSelect={onLogout}>
              <LogOut /> Çıkış yap
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  )
}
