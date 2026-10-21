import type { PublicUser, Role } from '@karar-hali/shared'

/**
 * Panel izinleri — API'deki yetkilerle aynıdır (asıl kontrol API'dedir; burası yalnızca arayüzü gizler).
 * editor: katalog, içerik, medya · admin: + ayarlar, mesajlar · owner: + kullanıcılar
 */
const permissions = {
  catalog: ['owner', 'admin', 'editor'],
  content: ['owner', 'admin', 'editor'],
  media: ['owner', 'admin', 'editor'],
  messages: ['owner', 'admin'],
  settings: ['owner', 'admin'],
  users: ['owner'],
} as const satisfies Record<string, readonly Role[]>

export type Permission = keyof typeof permissions

export function can(user: Pick<PublicUser, 'role'> | null | undefined, permission: Permission) {
  return !!user && (permissions[permission] as readonly Role[]).includes(user.role)
}

export const roleLabels: Record<Role, string> = {
  owner: 'Ana kullanıcı',
  admin: 'Yönetici',
  editor: 'Editör',
}
