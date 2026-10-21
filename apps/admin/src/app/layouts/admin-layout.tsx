import { useQueryClient } from '@tanstack/react-query'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { useState } from 'react'
import { Outlet, useNavigate, useNavigation } from 'react-router'
import { toast } from 'sonner'
import { can } from '@/auth/permissions'
import { logout } from '@/auth/session'
import { useUser } from '@/auth/use-user'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useDashboard } from '@/features/dashboard/api'
import { cn } from '@/lib/cn'

/** Kenar menüsü + üst çubuk + içerik. Mobilde menü soldan açılan çekmecedir. */
export function AdminLayout() {
  const user = useUser()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const queryClient = useQueryClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const dashboard = useDashboard()
  const newMessages = can(user, 'messages') ? (dashboard.data?.newMessages ?? 0) : 0

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Oturum zaten düşmüş olabilir; yine de girişe dön.
    }
    queryClient.clear()
    toast.success('Çıkış yapıldı')
    navigate('/login', { replace: true })
  }

  const sidebar = (
    <Sidebar
      user={user}
      newMessages={newMessages}
      onNavigate={() => setMenuOpen(false)}
      onLogout={handleLogout}
    />
  )

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-surface lg:block">
        {sidebar}
      </aside>

      <DialogPrimitive.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="animate-fade-in fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm lg:hidden" />
          <DialogPrimitive.Content className="animate-slide-in fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface focus:outline-none lg:hidden">
            <DialogPrimitive.Title className="sr-only">Yönetim menüsü</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Sayfalar arasında gezinin
            </DialogPrimitive.Description>
            {sidebar}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <Topbar
        user={user}
        newMessages={newMessages}
        onOpenMenu={() => setMenuOpen(true)}
        onLogout={handleLogout}
      />

      {/* Sayfa geçişlerinde ince yükleme çubuğu */}
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent transition-transform duration-500',
          navigation.state === 'loading' ? 'scale-x-75' : 'scale-x-0',
        )}
      />

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  )
}
