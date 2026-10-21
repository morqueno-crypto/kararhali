import { zodResolver } from '@hookform/resolvers/zod'
import { createUserInputSchema, passwordSchema, type PublicUser } from '@karar-hali/shared'
import { Crown, Pencil, Plus, Trash2, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { roleLabels } from '@/auth/permissions'
import { RoleGate } from '@/auth/role-gate'
import { useUser } from '@/auth/use-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input, NativeSelect } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Switch } from '@/components/ui/switch'
import { Table, TD, TH, THead, TR } from '@/components/ui/table'
import { useConfirm } from '@/components/ui/use-confirm'
import { applyApiErrors } from '@/lib/form-errors'
import { formatRelative, initials } from '@/lib/format'
import { errorMessage, HttpError } from '@/lib/http'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from './api'
import { PasswordInput } from './password-input'

const roleHelp = {
  admin: 'Katalog, içerik, medya, mesajlar ve site ayarları',
  editor: 'Katalog, içerik ve medya',
} as const

type DialogState = { mode: 'create' } | { mode: 'edit'; user: PublicUser } | null

export function UsersPage() {
  return (
    <RoleGate permission="users">
      <UsersList />
    </RoleGate>
  )
}

function UsersList() {
  const me = useUser()
  const [dialog, setDialog] = useState<DialogState>(null)
  const { data, error, isPending, refetch } = useUsers()
  const update = useUpdateUser()
  const remove = useDeleteUser()
  const confirm = useConfirm()

  async function toggleActive(user: PublicUser) {
    try {
      await update.mutateAsync({ id: user.id, active: !user.active })
      toast.success(
        user.active
          ? `${user.name} pasifleştirildi; oturumları kapatıldı`
          : `${user.name} etkinleştirildi`,
      )
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  async function onDelete(user: PublicUser) {
    const ok = await confirm({
      title: `${user.name} silinsin mi?`,
      description:
        'Kullanıcı ve açık oturumları kalıcı olarak silinecek. Geçici olarak engellemek için silmek yerine pasifleştirebilirsiniz.',
      confirmLabel: 'Kullanıcıyı sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(user.id)
      toast.success(`${user.name} silindi`)
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kullanıcılar"
        description="Panele erişebilecek kişiler. Sitede kayıt olma yoktur; hesapları yalnızca siz açabilirsiniz."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Kullanıcılar' }]}
        actions={
          <Button onClick={() => setDialog({ mode: 'create' })}>
            <UserPlus /> Yeni kullanıcı
          </Button>
        }
      />

      <Card>
        {error ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : isPending ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : data.length <= 1 ? (
          <>
            <UsersTable
              users={data}
              me={me}
              onEdit={() => undefined}
              onToggle={() => undefined}
              onDelete={() => undefined}
            />
            <EmptyState
              icon={Users}
              title="Henüz başka kullanıcı yok"
              description="Ekibinizden birine panel erişimi vermek için yeni kullanıcı oluşturun."
              action={
                <Button onClick={() => setDialog({ mode: 'create' })}>
                  <Plus /> Kullanıcı ekle
                </Button>
              }
            />
          </>
        ) : (
          <UsersTable
            users={data}
            me={me}
            onEdit={(user) => setDialog({ mode: 'edit', user })}
            onToggle={(user) => void toggleActive(user)}
            onDelete={(user) => void onDelete(user)}
          />
        )}
      </Card>

      {dialog?.mode === 'create' && <CreateUserDialog onClose={() => setDialog(null)} />}
      {dialog?.mode === 'edit' && (
        <EditUserDialog user={dialog.user} onClose={() => setDialog(null)} />
      )}
    </div>
  )
}

function UsersTable({
  users,
  me,
  onEdit,
  onToggle,
  onDelete,
}: {
  users: PublicUser[]
  me: PublicUser
  onEdit: (user: PublicUser) => void
  onToggle: (user: PublicUser) => void
  onDelete: (user: PublicUser) => void
}) {
  return (
    <Table>
      <THead>
        <tr>
          <TH>Kullanıcı</TH>
          <TH>Rol</TH>
          <TH>Son giriş</TH>
          <TH>Durum</TH>
          <TH className="text-right">İşlemler</TH>
        </tr>
      </THead>
      <tbody>
        {users.map((user) => {
          const isOwner = user.role === 'owner'
          return (
            <TR key={user.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-raised text-xs font-bold text-muted">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">
                      {user.name}{' '}
                      {user.id === me.id && (
                        <span className="text-xs font-normal text-subtle">(siz)</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-subtle">{user.email}</p>
                  </div>
                </div>
              </TD>
              <TD>
                <Badge tone={isOwner ? 'accent' : user.role === 'admin' ? 'info' : 'neutral'}>
                  {isOwner && <Crown className="size-3" />}
                  {roleLabels[user.role]}
                </Badge>
              </TD>
              <TD className="text-xs whitespace-nowrap text-muted">
                {user.lastLoginAt ? formatRelative(user.lastLoginAt) : 'Hiç giriş yapmadı'}
              </TD>
              <TD>
                {isOwner ? (
                  <Badge tone="success" dot>
                    Etkin
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.active}
                      onCheckedChange={() => onToggle(user)}
                      label={`${user.name} etkin`}
                    />
                    <span className="text-xs text-muted">{user.active ? 'Etkin' : 'Pasif'}</span>
                  </div>
                )}
              </TD>
              <TD>
                {isOwner ? (
                  <p className="text-right text-xs text-subtle">Şifrenizi Profil'den değiştirin</p>
                ) : (
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      aria-label={`${user.name} düzenle`}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(user)}
                      aria-label={`${user.name} sil`}
                      className="hover:text-danger"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                )}
              </TD>
            </TR>
          )
        })}
      </tbody>
    </Table>
  )
}

type CreateForm = z.input<typeof createUserInputSchema>
type CreateOutput = z.output<typeof createUserInputSchema>

function CreateUserDialog({ onClose }: { onClose: () => void }) {
  const create = useCreateUser()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateForm, unknown, CreateOutput>({
    resolver: zodResolver(createUserInputSchema),
    defaultValues: { name: '', email: '', password: '', role: 'editor' },
  })
  const role = useWatch({ control, name: 'role' })

  async function onSubmit(values: CreateOutput) {
    try {
      const { user } = await create.mutateAsync(values)
      toast.success(
        `${user.name} oluşturuldu. Giriş bilgilerini kendisiyle güvenli bir yoldan paylaşın.`,
      )
      onClose()
    } catch (error) {
      if (error instanceof HttpError && error.status === 409)
        setError('email', { message: 'Bu e-posta ile bir kullanıcı zaten var' })
      else if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Yeni kullanıcı"
      description="Hesap hemen etkin olur. Şifreyi kullanıcıyla paylaşın; ilk girişte Profil'den değiştirebilir."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="create-user" loading={create.isPending}>
            Kullanıcıyı oluştur
          </Button>
        </>
      }
    >
      <form id="create-user" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Ad soyad" error={errors.name?.message}>
          {(props) => <Input {...props} {...register('name')} autoFocus autoComplete="off" />}
        </Field>
        <Field label="E-posta" error={errors.email?.message}>
          {(props) => <Input {...props} type="email" {...register('email')} autoComplete="off" />}
        </Field>
        <Field label="Rol" error={errors.role?.message} hint={roleHelp[role ?? 'editor']}>
          {(props) => (
            <NativeSelect {...props} {...register('role')}>
              <option value="editor">{roleLabels.editor}</option>
              <option value="admin">{roleLabels.admin}</option>
            </NativeSelect>
          )}
        </Field>
        <Field
          label="Şifre"
          error={errors.password?.message}
          hint="En az 10 karakter. Üret düğmesiyle güçlü bir şifre oluşturabilirsiniz."
        >
          {(props) => (
            <PasswordInput
              {...props}
              {...register('password')}
              onGenerate={(password) => setValue('password', password, { shouldValidate: true })}
            />
          )}
        </Field>
      </form>
    </Dialog>
  )
}

const editSchema = z.object({
  name: z.string().trim().min(2, 'Ad en az 2 karakter olmalı').max(80),
  role: z.enum(['admin', 'editor']),
  active: z.boolean(),
  password: z.union([passwordSchema, z.literal('')]),
})
type EditForm = z.infer<typeof editSchema>

function EditUserDialog({ user, onClose }: { user: PublicUser; onClose: () => void }) {
  const update = useUpdateUser()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: user.name,
      role: user.role === 'admin' ? 'admin' : 'editor',
      active: user.active,
      password: '',
    },
  })
  const role = useWatch({ control, name: 'role' })

  async function onSubmit({ password, ...values }: EditForm) {
    try {
      await update.mutateAsync({ id: user.id, ...values, ...(password ? { password } : {}) })
      toast.success(
        password
          ? 'Kullanıcı güncellendi; yeni şifre için oturumları kapatıldı'
          : 'Kullanıcı güncellendi',
      )
      onClose()
    } catch (error) {
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={`${user.name} düzenle`}
      description={user.email}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="edit-user" loading={update.isPending}>
            Kaydet
          </Button>
        </>
      }
    >
      <form id="edit-user" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Ad soyad" error={errors.name?.message}>
          {(props) => <Input {...props} {...register('name')} />}
        </Field>
        <Field label="Rol" error={errors.role?.message} hint={roleHelp[role]}>
          {(props) => (
            <NativeSelect {...props} {...register('role')}>
              <option value="editor">{roleLabels.editor}</option>
              <option value="admin">{roleLabels.admin}</option>
            </NativeSelect>
          )}
        </Field>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas p-3">
              <span>
                <span className="block text-sm font-semibold text-ink">Hesap etkin</span>
                <span className="text-xs text-subtle">
                  Pasif kullanıcı giriş yapamaz, açık oturumları kapatılır.
                </span>
              </span>
              <Switch checked={field.value} onCheckedChange={field.onChange} label="Hesap etkin" />
            </label>
          )}
        />
        <Field
          label="Şifreyi sıfırla"
          error={errors.password?.message}
          hint="Değiştirmek istemiyorsanız boş bırakın."
        >
          {(props) => (
            <PasswordInput
              {...props}
              {...register('password')}
              placeholder="Yeni şifre"
              onGenerate={(password) => setValue('password', password, { shouldValidate: true })}
            />
          )}
        </Field>
      </form>
    </Dialog>
  )
}
