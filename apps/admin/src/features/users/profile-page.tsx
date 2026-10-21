import { zodResolver } from '@hookform/resolvers/zod'
import { passwordSchema } from '@karar-hali/shared'
import { KeyRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { roleLabels } from '@/auth/permissions'
import { useUser } from '@/auth/use-user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Field } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { applyApiErrors } from '@/lib/form-errors'
import { formatDateTime, initials } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useChangePassword } from './api'
import { PasswordInput } from './password-input'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifrenizi girin'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Şifreler eşleşmiyor',
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    path: ['newPassword'],
    message: 'Yeni şifre mevcut şifreden farklı olmalı',
  })
type FormValues = z.infer<typeof schema>

export function ProfilePage() {
  const user = useUser()
  const change = useChangePassword()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  async function onSubmit({ currentPassword, newPassword }: FormValues) {
    try {
      await change.mutateAsync({ currentPassword, newPassword })
      reset()
      toast.success('Şifreniz değiştirildi. Diğer cihazlardaki oturumlarınız kapatıldı.')
    } catch (error) {
      // Hatalı mevcut şifre API'den alan hatası olarak döner
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profil" breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Profil' }]} />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex size-20 items-center justify-center rounded-full bg-accent/15 font-display text-2xl font-extrabold text-accent ring-1 ring-accent/30">
              {initials(user.name)}
            </span>
            <p className="mt-4 text-lg font-bold text-ink">{user.name}</p>
            <p className="text-sm text-subtle">{user.email}</p>
            <Badge tone="accent" className="mt-3">
              {roleLabels[user.role]}
            </Badge>
          </div>
          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Hesap oluşturma</dt>
              <dd className="text-ink">{formatDateTime(user.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-subtle">Son giriş</dt>
              <dd className="text-ink">
                {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '—'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader
            title="Şifre değiştir"
            description="Şifreniz değişince bu cihaz dışındaki tüm oturumlarınız kapatılır."
          />
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md space-y-4 p-5">
            <Field label="Mevcut şifre" error={errors.currentPassword?.message}>
              {(props) => (
                <PasswordInput
                  {...props}
                  {...register('currentPassword')}
                  autoComplete="current-password"
                />
              )}
            </Field>
            <Field label="Yeni şifre" error={errors.newPassword?.message} hint="En az 10 karakter">
              {(props) => <PasswordInput {...props} {...register('newPassword')} />}
            </Field>
            <Field label="Yeni şifre (tekrar)" error={errors.confirmPassword?.message}>
              {(props) => <PasswordInput {...props} {...register('confirmPassword')} />}
            </Field>
            <Button type="submit" loading={change.isPending}>
              <KeyRound /> Şifreyi değiştir
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
