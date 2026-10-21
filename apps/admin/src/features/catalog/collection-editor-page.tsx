import { zodResolver } from '@hookform/resolvers/zod'
import {
  collectionInputSchema,
  sizeSchema,
  type AdminCollection,
  type AdminModel,
} from '@karar-hali/shared'
import { ArrowLeft, ExternalLink, Plus, Save, Trash2, X } from 'lucide-react'
import { useState, type KeyboardEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import type { z } from 'zod'
import { RoleGate } from '@/auth/role-gate'
import { Button, buttonClass } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input, NativeSelect, Textarea } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Switch } from '@/components/ui/switch'
import { useConfirm } from '@/components/ui/use-confirm'
import { ImageField } from '@/features/media'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { applyApiErrors } from '@/lib/form-errors'
import { formatDateTime, slugify } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useCollection, useDeleteCollection, useSaveCollection } from './api'
import { categoryLabels, formatSize, sizePresets } from './labels'
import { ModelsSection } from './models-section'

const formSchema = collectionInputSchema.omit({ sortOrder: true })
type FormInput = z.input<typeof formSchema>
type FormOutput = z.output<typeof formSchema>

export function CollectionEditorPage() {
  return (
    <RoleGate permission="catalog">
      <CollectionEditor />
    </RoleGate>
  )
}

function CollectionEditor() {
  const params = useParams()
  const id = params.id ? Number(params.id) : undefined
  const { data, error, isPending, refetch } = useCollection(id)

  if (id === undefined) return <EditorForm />
  if (error) return <QueryError error={error} onRetry={() => void refetch()} />
  if (isPending)
    return (
      <div className="space-y-6">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-[32rem] rounded-2xl" />
      </div>
    )
  // key: başka bir koleksiyona geçildiğinde form sıfırdan kurulur
  return <EditorForm key={data.collection.id} collection={data.collection} models={data.models} />
}

function EditorForm({
  collection,
  models,
}: {
  collection?: AdminCollection
  models?: AdminModel[]
}) {
  const isNew = !collection
  const navigate = useNavigate()
  const confirm = useConfirm()
  const save = useSaveCollection(collection?.id)
  const remove = useDeleteCollection()
  // Yeni koleksiyonda adres, kullanıcı elle değiştirene kadar addan üretilir.
  const [slugTouched, setSlugTouched] = useState(!isNew)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: collection
      ? {
          name: collection.name,
          slug: collection.slug,
          category: collection.category,
          sizes: collection.sizes,
          coverImage: collection.coverImage,
          description: collection.description,
          featured: collection.featured,
          published: collection.published,
        }
      : {
          name: '',
          slug: '',
          category: 'carpet',
          sizes: [],
          coverImage: null,
          description: { tr: '', en: '' },
          featured: false,
          published: true,
        },
  })

  const category = useWatch({ control, name: 'category' })
  const slug = useWatch({ control, name: 'slug' })

  async function onSubmit(values: FormOutput) {
    try {
      const result = await save.mutateAsync(values)
      if (isNew) {
        toast.success('Koleksiyon oluşturuldu. Şimdi modelleri ekleyebilirsiniz.')
        void navigate(`/collections/${result.collection.id}`, { replace: true })
      } else {
        toast.success('Değişiklikler kaydedildi')
        reset(values)
      }
    } catch (error) {
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  async function onDelete() {
    if (!collection) return
    const ok = await confirm({
      title: `${collection.name} silinsin mi?`,
      description: `Koleksiyon ve içindeki ${models?.length ?? 0} model kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      confirmLabel: 'Koleksiyonu sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(collection.id)
      toast.success(`${collection.name} silindi`)
      void navigate('/collections', { replace: true })
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? 'Yeni koleksiyon' : collection.name}
        description={
          isNew
            ? 'Koleksiyon bilgilerini girin; kaydettikten sonra modelleri ekleyebilirsiniz.'
            : `Son güncelleme: ${formatDateTime(collection.updatedAt)}`
        }
        breadcrumb={[
          { label: 'Panel', to: '/' },
          { label: 'Koleksiyonlar', to: '/collections' },
          { label: isNew ? 'Yeni' : collection.name },
        ]}
        actions={
          <>
            <Link to="/collections" className={buttonClass('secondary')}>
              <ArrowLeft /> Listeye dön
            </Link>
            {!isNew && (
              <a
                href={`${env.VITE_SITE_URL}/tr/koleksiyonlar/${collection.slug}`}
                target="_blank"
                rel="noreferrer"
                className={buttonClass('secondary')}
              >
                <ExternalLink /> Sitede gör
              </a>
            )}
          </>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-6 xl:grid-cols-[1fr_22rem]"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Genel bilgiler"
              description="Koleksiyonun adı, adresi ve ebatları."
            />
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Field label="Koleksiyon adı" error={errors.name?.message}>
                {(props) => (
                  <Input
                    {...props}
                    {...register('name', {
                      onChange: (event: { target: { value: string } }) => {
                        if (!slugTouched)
                          setValue('slug', slugify(event.target.value), { shouldDirty: true })
                      },
                    })}
                    placeholder="ör. Patara"
                    autoFocus={isNew}
                  />
                )}
              </Field>
              <Field
                label="Adres (slug)"
                error={errors.slug?.message}
                hint={slug ? `/tr/koleksiyonlar/${slug}` : 'Addan otomatik üretilir'}
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register('slug', { onChange: () => setSlugTouched(true) })}
                    placeholder="patara"
                  />
                )}
              </Field>
              <Field label="Kategori" error={errors.category?.message}>
                {(props) => (
                  <NativeSelect {...props} {...register('category')}>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              </Field>
              <Controller
                control={control}
                name="sizes"
                render={({ field, fieldState }) => (
                  <Field
                    label="Ebatlar"
                    className="sm:col-span-2"
                    error={
                      fieldState.error?.message ??
                      (Array.isArray(errors.sizes)
                        ? errors.sizes.find(Boolean)?.message
                        : undefined)
                    }
                    hint="Halı için 200x290, rulo kesim için 200xR biçiminde yazıp Enter'a basın."
                  >
                    {(props) => (
                      <SizesInput
                        {...props}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        presets={sizePresets[category ?? 'carpet']}
                      />
                    )}
                  </Field>
                )}
              />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Açıklama"
              description="Koleksiyon sayfasında görünen tanıtım metni."
            />
            <div className="grid gap-5 p-5 lg:grid-cols-2">
              <Field label="Türkçe" error={errors.description?.tr?.message}>
                {(props) => <Textarea {...props} rows={6} {...register('description.tr')} />}
              </Field>
              <Field label="English" error={errors.description?.en?.message}>
                {(props) => <Textarea {...props} rows={6} {...register('description.en')} />}
              </Field>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader title="Yayın" />
            <div className="space-y-4 p-5">
              <Controller
                control={control}
                name="published"
                render={({ field }) => (
                  <ToggleRow
                    title="Yayında"
                    description="Kapalıyken koleksiyon sitede görünmez."
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <ToggleRow
                    title="Öne çıkan"
                    description="Ana sayfadaki öne çıkan koleksiyonlarda gösterilir."
                    checked={!!field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <Button type="submit" loading={save.isPending} disabled={!isNew && !isDirty}>
                  <Save /> {isNew ? 'Koleksiyonu oluştur' : 'Değişiklikleri kaydet'}
                </Button>
                {!isNew && (
                  <Button
                    variant="danger"
                    onClick={() => void onDelete()}
                    loading={remove.isPending}
                  >
                    <Trash2 /> Koleksiyonu sil
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Kapak görseli"
              description="Boş bırakılırsa ilk modelin görseli kullanılır."
            />
            <div className="p-5">
              <Controller
                control={control}
                name="coverImage"
                render={({ field, fieldState }) => (
                  <>
                    <ImageField
                      value={field.value}
                      onChange={field.onChange}
                      nullable
                      invalid={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <p className="text-danger mt-1.5 text-xs">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </Card>
        </aside>
      </form>

      {collection && models && <ModelsSection collection={collection} models={models} />}
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-subtle">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} label={title} />
    </div>
  )
}

interface SizesInputProps {
  id: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
  value: string[]
  onChange: (value: string[]) => void
  presets: string[]
}

/** Ebat çipleri: yazıp Enter/virgül ile ekle, çipteki × ile çıkar, hazır ebatlara tıkla. */
function SizesInput({ value, onChange, presets, ...props }: SizesInputProps) {
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState<string | null>(null)

  function add(raw: string) {
    const size = raw.trim().replace('×', 'x').replace(/r$/, 'R')
    if (!size) return
    const parsed = sizeSchema.safeParse(size)
    if (!parsed.success) {
      setDraftError(parsed.error.issues[0]?.message ?? 'Geçersiz ebat')
      return
    }
    if (!value.includes(parsed.data)) onChange([...value, parsed.data])
    setDraft('')
    setDraftError(null)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add(draft)
    } else if (event.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const available = presets.filter((preset) => !value.includes(preset))

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border bg-canvas px-2 py-1.5 transition-colors focus-within:border-accent',
          props['aria-invalid'] || draftError
            ? 'border-danger'
            : 'hover:border-line-strong border-line',
        )}
      >
        {value.map((size) => (
          <span
            key={size}
            className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 py-0.5 pr-1 pl-2 text-xs font-semibold text-accent"
          >
            {formatSize(size)}
            <button
              type="button"
              onClick={() => onChange(value.filter((item) => item !== size))}
              aria-label={`${formatSize(size)} ebatını çıkar`}
              className="rounded p-0.5 hover:bg-accent/20"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          {...props}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            setDraftError(null)
          }}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={value.length ? '' : '200x290'}
          className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm text-ink placeholder:text-subtle focus:outline-none"
        />
      </div>
      {draftError && <p className="text-danger text-xs">{draftError}</p>}
      {available.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-subtle">Hızlı ekle:</span>
          {available.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange([...value, preset])}
              className="inline-flex items-center gap-1 rounded-lg border border-line px-2 py-0.5 text-[11px] font-semibold text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Plus className="size-3" /> {preset}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
