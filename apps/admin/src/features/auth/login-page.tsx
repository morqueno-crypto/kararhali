import { zodResolver } from '@hookform/resolvers/zod'
import { loginInputSchema } from '@karar-hali/shared'
import { useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import type { z } from 'zod'
import { Brand } from '@/components/layout/brand'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/form-controls'
import { http, HttpError } from '@/lib/http'

type LoginValues = z.input<typeof loginInputSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginInputSchema) })

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    try {
      await http('/auth/login', { method: 'POST', json: values })
      queryClient.clear()
      // Yalnızca panel içi dönüş adreslerine izin verilir (açık yönlendirme engeli).
      const next = searchParams.get('next')
      navigate(next?.startsWith('/') && !next.startsWith('//') ? next : '/', { replace: true })
    } catch (error) {
      setFormError(
        error instanceof HttpError && [401, 429].includes(error.status)
          ? error.message
          : 'Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.',
      )
    }
  }

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <div
        className="absolute top-1/4 left-1/2 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Brand />
        </div>
        <div className="mt-8 rounded-2xl border border-line bg-surface/90 p-7 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold text-ink">Giriş yapın</h1>
              <p className="text-xs text-subtle">Yalnızca yetkili kullanıcılar içindir.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            <Field label="E-posta" error={errors.email && 'Geçerli bir e-posta girin'}>
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  autoComplete="username"
                  autoFocus
                  {...register('email')}
                />
              )}
            </Field>
            <Field label="Şifre" error={errors.password && 'Şifrenizi girin'}>
              {(props) => (
                <div className="relative">
                  <Input
                    {...props}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-subtle hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              )}
            </Field>

            {formError && (
              <p
                role="alert"
                className="border-danger/30 bg-danger/10 text-danger rounded-xl border px-3 py-2.5 text-xs"
              >
                {formError}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full">
              Giriş yap
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-subtle">
          Hesap açma yetkisi yalnızca ana kullanıcıdadır.
        </p>
      </div>
    </main>
  )
}
