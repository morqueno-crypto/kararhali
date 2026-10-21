import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/feedback'
import { can, type Permission } from './permissions'
import { useUser } from './use-user'

/** İzni olmayan kullanıcıya sayfa yerine bilgilendirme gösterir. */
export function RoleGate({
  permission,
  children,
}: {
  permission: Permission
  children: ReactNode
}) {
  const user = useUser()
  if (can(user, permission)) return children
  return (
    <Card>
      <EmptyState
        icon={ShieldAlert}
        title="Bu sayfaya erişim yetkiniz yok"
        description="Gerekli yetki için ana kullanıcıyla iletişime geçin."
      />
    </Card>
  )
}
