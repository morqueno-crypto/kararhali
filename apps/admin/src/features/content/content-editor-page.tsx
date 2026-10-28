import { zodResolver } from '@hookform/resolvers/zod'
import { contentBlockSchemas, contentKeys, type ContentKey, type Locale } from '@karar-hali/shared'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ExternalLink,
  FileQuestion,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import {
  Controller,
  useForm,
  type FieldErrors,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import type { z } from 'zod'
import { RoleGate } from '@/auth/role-gate'
import { Button, buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input, Textarea } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Thumb } from '@/components/ui/thumb'
import { ImageField, MediaPicker } from '@/features/media'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { applyApiErrors } from '@/lib/form-errors'
import { formatDateTime } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useContentBlock, useSaveContent } from './api'
import { blockDefs, emptyBlock, type BlockDef, type FieldDef } from './blocks'

const localeLabels: Record<Locale, string> = { tr: 'Türkçe', en: 'English' }

export function ContentEditorPage() {
  const { key } = useParams()
  return (
    <RoleGate permission="content">
      {contentKeys.includes(key as ContentKey) ? (
        <ContentEditor key={key} contentKey={key as ContentKey} />
      ) : (
        <Card>
          <EmptyState
            icon={FileQuestion}
            title="Bölüm bulunamadı"
            action={
              <Link to="/content" className={buttonClass('secondary')}>
                İçeriklere dön
              </Link>
            }
          />
        </Card>
      )}
    </RoleGate>
  )
}

function ContentEditor({ contentKey }: { contentKey: ContentKey }) {
  const { data, error, isPending, refetch } = useContentBlock(contentKey)
  if (error) return <QueryError error={error} onRetry={() => void refetch()} />
  if (isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-[32rem] rounded-2xl" />
      </div>
    )
  const def = blockDefs[contentKey]
  return (
    <BlockForm
      contentKey={contentKey}
      def={def}
      initial={(data.data as FieldValues | null) ?? emptyBlock(def)}
      updatedAt={data.updatedAt}
    />
  )
}

function BlockForm({
  contentKey,
  def,
  initial,
  updatedAt,
}: {
  contentKey: ContentKey
  def: BlockDef
  initial: FieldValues
  updatedAt: string | null
}) {
  const [locale, setLocale] = useState<Locale>('tr')
  const save = useSaveContent(contentKey)
  const form = useForm<FieldValues>({
    resolver: zodResolver(
      contentBlockSchemas[contentKey] as unknown as z.ZodType<FieldValues, FieldValues>,
    ),
    defaultValues: initial,
  })
  const {
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = form

  async function onSubmit(values: FieldValues) {
    try {
      const saved = await save.mutateAsync(values)
      reset(saved.data as FieldValues)
      toast.success(`${def.title} kaydedildi`, {
        description: 'Sitede en geç bir dakika içinde görünür (sayfayı yenileyince hemen).',
      })
    } catch (error) {
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  function onInvalid(fieldErrors: FieldErrors) {
    // Hatalı alan diğer dildeyse o sekmeye geç
    if (!fieldErrors[locale]) setLocale(locale === 'tr' ? 'en' : 'tr')
    toast.error('Bazı alanlar eksik veya geçersiz.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={def.title}
        description={
          updatedAt
            ? `${def.description} Son güncelleme: ${formatDateTime(updatedAt)}`
            : def.description
        }
        breadcrumb={[
          { label: 'Panel', to: '/' },
          { label: 'İçerikler', to: '/content' },
          { label: def.group },
          { label: def.title },
        ]}
        actions={
          <>
            <Link to="/content" className={buttonClass('secondary')}>
              <ArrowLeft /> İçerikler
            </Link>
            <a
              href={`${env.VITE_SITE_URL}${def.sitePath}`}
              target="_blank"
              rel="noreferrer"
              className={buttonClass('secondary')}
            >
              <ExternalLink /> Sitede gör
            </a>
          </>
        }
      />

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        <Tabs value={locale} onValueChange={(value) => setLocale(value as Locale)}>
          <Card>
            <div className="sticky top-16 z-10 flex flex-col gap-3 rounded-t-2xl border-b border-line bg-surface/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <TabsList
                items={(['tr', 'en'] as const).map((value) => ({
                  value,
                  label: (
                    <>
                      {localeLabels[value]}
                      {errors[value] && (
                        <span
                          className="bg-danger size-1.5 rounded-full"
                          aria-label="hatalı alan var"
                        />
                      )}
                    </>
                  ),
                }))}
              />
              <div className="flex items-center gap-3">
                {isDirty && (
                  <span className="text-warning text-xs">Kaydedilmemiş değişiklikler var</span>
                )}
                <Button type="submit" loading={save.isPending} disabled={!isDirty}>
                  <Save /> Kaydet
                </Button>
              </div>
            </div>
            {(['tr', 'en'] as const).map((value) => (
              <TabsContent
                key={value}
                value={value}
                forceMount
                className="data-[state=inactive]:hidden"
              >
                <div className="grid gap-5 p-5 md:grid-cols-2">
                  {def.fields.map((field) => (
                    <FieldControl key={field.name} form={form} locale={value} field={field} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Card>
        </Tabs>
      </form>
    </div>
  )
}

/** "tr.items.0.title" gibi bir yoldaki hata mesajı */
function getError(errors: FieldErrors, path: string): string | undefined {
  let node: unknown = errors
  for (const part of path.split('.')) {
    if (node == null || typeof node !== 'object') return undefined
    node = (node as Record<string, unknown>)[part]
  }
  const message = (node as { message?: unknown } | undefined)?.message
  return typeof message === 'string' ? message : undefined
}

const wide: FieldDef['type'][] = [
  'textarea',
  'image',
  'stringList',
  'imageList',
  'items',
  'stats',
  'slides',
]

function FieldControl({
  form,
  locale,
  field: def,
}: {
  form: UseFormReturn<FieldValues>
  locale: Locale
  field: FieldDef
}) {
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form
  const path = `${locale}.${def.name}`
  const other = `${locale === 'tr' ? 'en' : 'tr'}.${def.name}`
  const error = getError(errors, path)
  const className = wide.includes(def.type) ? 'md:col-span-2' : undefined

  /** Görseller iki dilde aynıysa birlikte güncellenir (çoğu görsel dilden bağımsızdır). */
  function syncOther(previous: unknown, next: unknown) {
    if (JSON.stringify(getValues(other)) === JSON.stringify(previous)) {
      setValue(other, next, { shouldDirty: true })
    }
  }

  switch (def.type) {
    case 'divider':
      return (
        <div className="border-t border-line pt-5 md:col-span-2 [&:first-child]:border-0 [&:first-child]:pt-0">
          <h3 className="text-sm font-bold text-ink">{def.label}</h3>
          {def.hint && <p className="mt-0.5 text-xs text-subtle">{def.hint}</p>}
        </div>
      )
    case 'text':
      return (
        <Field label={def.label} hint={def.hint} error={error} className={className}>
          {(props) => <Input {...props} {...register(path)} />}
        </Field>
      )
    case 'textarea':
      return (
        <Field label={def.label} hint={def.hint} error={error} className={className}>
          {(props) => <Textarea {...props} rows={4} {...register(path)} />}
        </Field>
      )
    case 'image':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <Field
              label={def.label}
              error={error}
              hint="İki dilde aynı görsel kullanılıyorsa birlikte değişir."
              className={className}
            >
              {(props) => (
                <ImageField
                  id={props.id}
                  value={field.value as string}
                  invalid={!!error}
                  onChange={(url) => {
                    syncOther(field.value, url ?? '')
                    field.onChange(url ?? '')
                  }}
                />
              )}
            </Field>
          )}
        />
      )
    case 'imageList':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <ListShell label={def.label} error={error} className={className}>
              <ImageListEditor
                value={(field.value as string[]) ?? []}
                onChange={(next) => {
                  syncOther(field.value, next)
                  field.onChange(next)
                }}
              />
            </ListShell>
          )}
        />
      )
    case 'stringList':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <ListShell label={def.label} error={error} className={className}>
              <ListEditor
                value={(field.value as string[]) ?? []}
                onChange={field.onChange}
                create={() => ''}
                addLabel="Paragraf ekle"
                renderItem={(item, index, update) => (
                  <Textarea
                    aria-label={`${def.label} ${index + 1}`}
                    aria-invalid={!!getError(errors, `${path}.${index}`)}
                    rows={3}
                    value={item}
                    onChange={(event) => update(event.target.value)}
                  />
                )}
              />
            </ListShell>
          )}
        />
      )
    case 'items':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <ListShell label={def.label} error={error} className={className}>
              <ListEditor
                value={(field.value as { title: string; text: string }[]) ?? []}
                onChange={field.onChange}
                create={() => ({ title: '', text: '' })}
                addLabel="Madde ekle"
                renderItem={(item, index, update) => (
                  <div className="space-y-2">
                    <Input
                      aria-label={`${index + 1}. madde başlığı`}
                      aria-invalid={!!getError(errors, `${path}.${index}.title`)}
                      placeholder="Başlık"
                      value={item.title}
                      onChange={(event) => update({ ...item, title: event.target.value })}
                    />
                    <Textarea
                      aria-label={`${index + 1}. madde metni`}
                      aria-invalid={!!getError(errors, `${path}.${index}.text`)}
                      placeholder="Metin"
                      rows={2}
                      value={item.text}
                      onChange={(event) => update({ ...item, text: event.target.value })}
                    />
                  </div>
                )}
              />
            </ListShell>
          )}
        />
      )
    case 'stats':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <ListShell label={def.label} error={error} className={className}>
              <ListEditor
                value={(field.value as { value: string; label: string }[]) ?? []}
                onChange={field.onChange}
                create={() => ({ value: '', label: '' })}
                addLabel="Rakam ekle"
                renderItem={(item, index, update) => (
                  <div className="grid grid-cols-[8rem_1fr] gap-2">
                    <Input
                      aria-label={`${index + 1}. rakam değeri`}
                      aria-invalid={!!getError(errors, `${path}.${index}.value`)}
                      placeholder="1986"
                      value={item.value}
                      onChange={(event) => update({ ...item, value: event.target.value })}
                      className="font-display font-bold"
                    />
                    <Input
                      aria-label={`${index + 1}. rakam etiketi`}
                      aria-invalid={!!getError(errors, `${path}.${index}.label`)}
                      placeholder="Kuruluş yılı"
                      value={item.label}
                      onChange={(event) => update({ ...item, label: event.target.value })}
                    />
                  </div>
                )}
              />
            </ListShell>
          )}
        />
      )
    case 'slides':
      return (
        <Controller
          control={control}
          name={path}
          render={({ field }) => (
            <ListShell label={def.label} hint={def.hint} error={error} className={className}>
              <ListEditor
                value={(field.value as Slide[]) ?? []}
                onChange={(next) => {
                  syncSlideImages(field.value as Slide[], next)
                  field.onChange(next)
                }}
                create={() => ({ ...emptySlide })}
                addLabel="Slayt ekle"
                renderItem={(item, index, update) => {
                  const fieldError = (name: keyof Slide) =>
                    !!getError(errors, `${path}.${index}.${name}`)
                  return (
                    <div className="grid gap-3 lg:grid-cols-[16rem_1fr]">
                      <div className="min-w-0 space-y-2">
                        <ImageField
                          value={item.image}
                          invalid={fieldError('image')}
                          onChange={(url) => update({ ...item, image: url ?? '' })}
                          className="flex-col items-stretch [&>div:first-child]:aspect-video [&>div:first-child]:h-auto [&>div:first-child]:w-full"
                        />
                        <Input
                          aria-label={`${index + 1}. slayt görsel açıklaması`}
                          aria-invalid={fieldError('imageAlt')}
                          placeholder="Görsel açıklaması"
                          value={item.imageAlt}
                          onChange={(event) => update({ ...item, imageAlt: event.target.value })}
                        />
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          aria-label={`${index + 1}. slayt üst başlık`}
                          aria-invalid={fieldError('eyebrow')}
                          placeholder="Üst başlık"
                          value={item.eyebrow}
                          onChange={(event) => update({ ...item, eyebrow: event.target.value })}
                        />
                        <Input
                          aria-label={`${index + 1}. slayt vurgulu kısım`}
                          aria-invalid={fieldError('titleAccent')}
                          placeholder="Vurgulu kelime (başlıkta geçmeli)"
                          value={item.titleAccent}
                          onChange={(event) => update({ ...item, titleAccent: event.target.value })}
                        />
                        <Input
                          aria-label={`${index + 1}. slayt başlık`}
                          aria-invalid={fieldError('title')}
                          placeholder="Başlık"
                          value={item.title}
                          onChange={(event) => update({ ...item, title: event.target.value })}
                          className="font-display font-bold sm:col-span-2"
                        />
                        <Textarea
                          aria-label={`${index + 1}. slayt metin`}
                          aria-invalid={fieldError('text')}
                          placeholder="Metin"
                          rows={3}
                          value={item.text}
                          onChange={(event) => update({ ...item, text: event.target.value })}
                          className="sm:col-span-2"
                        />
                      </div>
                    </div>
                  )
                }}
              />
            </ListShell>
          )}
        />
      )
  }

  /** Slayt görseli değişince diğer dilde aynı sıradaki görsel de aynıysa birlikte güncellenir. */
  function syncSlideImages(previous: Slide[] = [], next: Slide[]) {
    const otherSlides = (getValues(other) as Slide[] | undefined) ?? []
    if (previous.length !== next.length) return
    let changed = false
    const synced = otherSlides.map((slide, index) => {
      const before = previous[index]?.image
      const after = next[index]?.image
      if (before !== after && slide.image === before && after !== undefined) {
        changed = true
        return { ...slide, image: after }
      }
      return slide
    })
    if (changed) setValue(other, synced, { shouldDirty: true })
  }
}

interface Slide {
  image: string
  imageAlt: string
  eyebrow: string
  title: string
  titleAccent: string
  text: string
}

const emptySlide: Slide = {
  image: '',
  imageAlt: '',
  eyebrow: '',
  title: '',
  titleAccent: '',
  text: '',
}

function ListShell({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    // fieldset varsayılan olarak içeriğinin en geniş hâli kadar daralmaz (min-width: min-content)
    <fieldset className={cn('min-w-0', className)}>
      <legend className="mb-1.5 text-xs font-semibold text-muted">{label}</legend>
      {hint && <p className="-mt-1 mb-2 text-xs text-subtle">{hint}</p>}
      {children}
      {error && <p className="text-danger mt-1.5 text-xs">{error}</p>}
    </fieldset>
  )
}

/** Sıralanabilir (yukarı/aşağı) genel liste düzenleyici */
function ListEditor<T>({
  value,
  onChange,
  create,
  addLabel,
  renderItem,
}: {
  value: T[]
  onChange: (value: T[]) => void
  create: () => T
  addLabel: string
  renderItem: (item: T, index: number, update: (item: T) => void) => ReactNode
}) {
  function move(from: number, to: number) {
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item as T)
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2 rounded-xl border border-line bg-canvas/50 p-2.5">
          <span className="mt-2 w-5 shrink-0 text-center text-xs font-bold text-subtle tabular-nums">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            {renderItem(item, index, (updated) =>
              onChange(value.map((old, i) => (i === index ? updated : old))),
            )}
          </div>
          <div className="flex shrink-0 flex-col">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => move(index, index - 1)}
              disabled={index === 0}
              aria-label="Yukarı taşı"
            >
              <ArrowUp />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => move(index, index + 1)}
              disabled={index === value.length - 1}
              aria-label="Aşağı taşı"
            >
              <ArrowDown />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label="Kaldır"
              className="hover:text-danger"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={() => onChange([...value, create()])}>
        <Plus /> {addLabel}
      </Button>
    </div>
  )
}

function ImageListEditor({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {value.map((url, index) => (
          <li key={`${url}-${index}`} className="group relative">
            <Thumb src={url} className="aspect-square w-full" />
            <Button
              variant="danger"
              size="icon"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`${index + 1}. görseli kaldır`}
              className="absolute top-1.5 right-1.5 size-7 bg-surface/90 opacity-0 backdrop-blur group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <Trash2 />
            </Button>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="border-line-strong flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-subtle transition-colors hover:border-accent hover:text-accent"
          >
            <Plus className="size-5" /> Görsel ekle
          </button>
        </li>
      </ul>
      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        onSelect={(url) => onChange([...value, url])}
      />
    </>
  )
}
