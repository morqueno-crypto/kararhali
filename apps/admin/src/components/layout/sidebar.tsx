import type { PublicUser } from '@karar-hali/shared'
import {
  FileText,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { NavLink } from 'react-router'
import { can, roleLabels, type Permission } from '@/auth/permissions'
import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'
import { Brand } from './brand'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  permission?: Permission
  badge?: number
  end?: boolean
}

interface SidebarProps {
  user: PublicUser
  newMessages: number
  onNavigate?: () => void
  onLogout: () => void
}

/** Sol menü: iş akışlarına göre gruplanmış (referanstaki gibi), aktif öğe altın tonlu. */
export function Sidebar({ user, newMessages, onNavigate, onLogout }: SidebarProps) {
  const groups: { label: string; items: NavItem[] }[] = [
    { label: 'Genel', items: [{ to: '/', label: 'Panel', icon: LayoutDashboard, end: true }] },
    {
      label: 'Katalog',
      items: [
        { to: '/collections', label: 'Koleksiyonlar', icon: Layers, permission: 'catalog' },
        { to: '/colors', label: 'Renkler', icon: Palette, permission: 'catalog' },
      ],
    },
    {
      label: 'İçerik',
      items: [
        { to: '/content', label: 'Sayfa içerikleri', icon: FileText, permission: 'content' },
        { to: '/media', label: 'Medya', icon: Images, permission: 'media' },
      ],
    },
    {
      label: 'İletişim',
      items: [
        {
          to: '/messages',
          label: 'Mesajlar',
          icon: Inbox,
          permission: 'messages',
          badge: newMessages,
        },
      ],
    },
    {
      label: 'Sistem',
      items: [
        { to: '/settings', label: 'Site ayarları', icon: Settings, permission: 'settings' },
        { to: '/users', label: 'Kullanıcılar', icon: Users, permission: 'users' },
        { to: '/profile', label: 'Profilim', icon: UserCog },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Brand />
      </div>
      <nav aria-label="Yönetim menüsü" className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((group) => {
          const items = group.items.filter((item) => !item.permission || can(user, item.permission))
          if (items.length === 0) return null
          return (
            <div key={group.label}>
              <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-subtle uppercase">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent/12 text-accent shadow-[inset_0_0_0_1px] shadow-accent/25'
                            : 'text-muted hover:bg-raised hover:text-ink',
                        )
                      }
                    >
                      <item.icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1">{item.label}</span>
                      {!!item.badge && (
                        <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-on-accent tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-raised text-xs font-bold text-ink">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-[11px] text-subtle">{roleLabels[user.role]}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Çıkış yap"
            title="Çıkış yap"
            className="hover:text-danger rounded-lg p-2 text-subtle transition-colors hover:bg-raised"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
