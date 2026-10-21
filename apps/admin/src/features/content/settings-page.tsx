import { zodResolver } from '@hookform/resolvers/zod'
import { settingSchemas, type SettingKey, type Settings } from '@karar-hali/shared'
import { Save } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Controller,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'
import { RoleGate } from '@/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input, Textarea } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { ImageField } from '@/features/media'
import { applyApiErrors } from '@/lib/form-errors'
import { formatDateTime } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useSaveSetting, useSettings } from './api'

const emptySettings: Settings = {
  general: {
    siteName: '',
    logo: '',
    tagline: { tr: '', en: '' },
    description: { tr: '', en: '' },
    dealerLoginUrl: '',
  },
  contact: {
    phone: '',
    phoneLines: '',
    fax: '',
    email: '',
    address: { tr: '', en: '' },
    hours: { tr: '', en: '' },
  },
  social: { instagram: '', facebook: '', linkedin: '', youtube: '' },
}

export function SettingsPage() {
  return (
    <RoleGate permission="settings">
      <SettingsTabs />
    </RoleGate>
  )
}

function SettingsTabs() {
  const { data, error, isPending, refetch } = useSettings()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site ayarları"
        description="Site adı, logo, iletişim bilgileri ve sosyal medya hesapları. Değişiklikler sitenin her sayfasına yansır."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Site ayarları' }]}
      />
      {error ? (
        <Card>
          <QueryError error={error} onRetry={() => void refetch()} />
        </Card>
      ) : isPending ? (
        <Skeleton className="h-[32rem] rounded-2xl" />
      ) : (
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList
            items={[
              { value: 'general', label: 'Genel' },
              { value: 'contact', label: 'İletişim' },
              { value: 'social', label: 'Sosyal medya' },
            ]}
          />
          {(['general', 'contact', 'social'] as const).map((key) => {
            const item = data.find((setting) => setting.key === key)
            return (
              <TabsContent key={key} value={key}>
                <SettingForm
                  settingKey={key}
                  initial={(item?.value ?? emptySettings[key]) as Settings[typeof key]}
                  updatedAt={item?.updatedAt ?? null}
                />
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}

function SettingForm<K extends SettingKey>({
  settingKey,
  initial,
  updatedAt,
}: {
  settingKey: K
  initial: Settings[K]
  updatedAt: string | null
}) {
  const save = useSaveSetting(settingKey)
  const form = useForm<FieldValues>({
    resolver: zodResolver(
      settingSchemas[settingKey] as unknown as z.ZodType<FieldValues, FieldValues>,
    ),
    defaultValues: initial as DefaultValues<FieldValues>,
  })
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = form

  async function onSubmit(values: FieldValues) {
    try {
      await save.mutateAsync(values)
      reset(values)
      toast.success('Ayarlar kaydedildi')
    } catch (error) {
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  /** "address.tr" gibi iç içe yollar için hata mesajı */
  function err(path: string) {
    const node = path
      .split('.')
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined,
        errors,
      )
    const message = (node as { message?: unknown } | undefined)?.message
    return typeof message === 'string' ? message : undefined
  }

  function text(
    path: string,
    label: string,
    props: { hint?: ReactNode; type?: string; placeholder?: string } = {},
  ) {
    return (
      <Field label={label} hint={props.hint} error={err(path)}>
        {(fieldProps) => (
          <Input
            {...fieldProps}
            type={props.type}
            placeholder={props.placeholder}
            {...register(path as Path<FieldValues>)}
          />
        )}
      </Field>
    )
  }

  function localizedPair(path: string, label: string, multiline = false) {
    return (['tr', 'en'] as const).map((locale) => {
      const fullPath = `${path}.${locale}`
      const fullLabel = `${label} (${locale === 'tr' ? 'Türkçe' : 'English'})`
      return (
        <Field key={locale} label={fullLabel} error={err(fullPath)}>
          {(fieldProps) =>
            multiline ? (
              <Textarea {...fieldProps} rows={3} {...register(fullPath)} />
            ) : (
              <Input {...fieldProps} {...register(fullPath)} />
            )
          }
        </Field>
      )
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          {settingKey === 'general' && (
            <>
              {text('siteName', 'Site adı')}
              {text('dealerLoginUrl', 'Bayi girişi adresi', {
                type: 'url',
                placeholder: 'https://',
                hint: 'Boş bırakılırsa menüde bayi girişi bağlantısı gösterilmez.',
              })}
              <Controller
                control={control}
                name="logo"
                render={({ field }) => (
                  <Field label="Logo" error={err('logo')} className="md:col-span-2">
                    {(fieldProps) => (
                      <ImageField
                        id={fieldProps.id}
                        value={field.value as string}
                        onChange={(url) => field.onChange(url ?? '')}
                        invalid={!!err('logo')}
                      />
                    )}
                  </Field>
                )}
              />
              {localizedPair('tagline', 'Slogan')}
              {localizedPair('description', 'Site açıklaması', true)}
            </>
          )}
          {settingKey === 'contact' && (
            <>
              {text('phone', 'Telefon', {
                type: 'tel',
                hint: 'Tıklanınca aranacak numara, ör. +90 342 000 00 00',
              })}
              {text('phoneLines', 'Görünen telefon metni', { hint: 'ör. 0342 000 00 00 (pbx)' })}
              {text('fax', 'Faks', { type: 'tel', hint: 'Boş bırakılabilir' })}
              {text('email', 'E-posta', { type: 'email' })}
              {localizedPair('address', 'Adres', true)}
              {localizedPair('hours', 'Çalışma saatleri')}
            </>
          )}
          {settingKey === 'social' && (
            <>
              {text('instagram', 'Instagram', {
                type: 'url',
                placeholder: 'https://instagram.com/…',
              })}
              {text('facebook', 'Facebook', { type: 'url', placeholder: 'https://facebook.com/…' })}
              {text('linkedin', 'LinkedIn', {
                type: 'url',
                placeholder: 'https://linkedin.com/company/…',
              })}
              {text('youtube', 'YouTube', { type: 'url', placeholder: 'https://youtube.com/@…' })}
              <p className="text-xs text-subtle md:col-span-2">
                Boş bırakılan hesaplar sitede gösterilmez.
              </p>
            </>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
          <span className="text-xs text-subtle">
            {updatedAt ? `Son güncelleme: ${formatDateTime(updatedAt)}` : 'Henüz kaydedilmedi'}
          </span>
          <Button type="submit" loading={save.isPending} disabled={!isDirty}>
            <Save /> Kaydet
          </Button>
        </div>
      </form>
    </Card>
  )
}
