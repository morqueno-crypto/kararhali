import { zodResolver } from '@hookform/resolvers/zod'
import {
  modelInputSchema,
  type AdminCollection,
  type AdminColor,
  type AdminModel,
} from '@karar-hali/shared'
import { useQueryClient } from '@tanstack/react-query'
import { EyeOff, Grid3x3, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/feedback'
import { Field, Input, NativeSelect } from '@/components/ui/form-controls'
import { SortableList } from '@/components/ui/sortable'
import { Switch } from '@/components/ui/switch'
import { Thumb } from '@/components/ui/thumb'
import { useConfirm } from '@/components/ui/use-confirm'
import { ImageField } from '@/features/media'
import { cn } from '@/lib/cn'
import { applyApiErrors } from '@/lib/form-errors'
import { errorMessage } from '@/lib/http'
import { catalogKeys, useColors, useDeleteModel, useReorderModels, useSaveModel } from './api'

const modelFormSchema = modelInputSchema.pick({
  code: true,
  colorKey: true,
  image: true,
  published: true,
})
type ModelFormInput = z.input<typeof modelFormSchema>
type ModelFormOutput = z.output<typeof modelFormSchema>

type DialogState = { mode: 'create' } | { mode: 'edit'; model: AdminModel } | null

/** Koleksiyondaki modeller: sürükle-bırak sıralama, ekle/düzenle/sil. */
export function ModelsSection({
  collection,
  models,
}: {
  collection: AdminCollection
  models: AdminModel[]
}) {
  const [dialog, setDialog] = useState<DialogState>(null)
  const { data: colors = [] } = useColors()
  const queryClient = useQueryClient()
  const reorder = useReorderModels(collection.id)
  const remove = useDeleteModel(collection.id)
  const confirm = useConfirm()
  const colorMap = new Map(colors.map((color) => [color.key, color]))

  function onReorder(items: AdminModel[]) {
    queryClient.setQueryData(
      catalogKeys.collection(collection.id),
      (old: { collection: AdminCollection; models: AdminModel[] } | undefined) =>
        old && { ...old, models: items },
    )
    reorder.mutate(
      items.map((item) => item.id),
      { onError: (error) => toast.error(errorMessage(error)) },
    )
  }

  async function onDelete(model: AdminModel) {
    const ok = await confirm({
      title: `${model.code} modeli silinsin mi?`,
      description: 'Model koleksiyondan kalıcı olarak kaldırılacak.',
      confirmLabel: 'Modeli sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(model.id)
      toast.success(`${model.code} silindi`)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <Card>
      <CardHeader
        title={`Modeller · ${models.length}`}
        description="Desen ve renk kombinasyonları. Sürükleyerek sitedeki sırayı değiştirin."
        actions={
          <Button size="sm" onClick={() => setDialog({ mode: 'create' })}>
            <Plus /> Model ekle
          </Button>
        }
      />
      {models.length === 0 ? (
        <EmptyState
          icon={Grid3x3}
          title="Bu koleksiyonda henüz model yok"
          description="Desen kodu, renk ve ürün fotoğrafıyla ilk modeli ekleyin."
          action={
            <Button onClick={() => setDialog({ mode: 'create' })}>
              <Plus /> İlk modeli ekle
            </Button>
          }
        />
      ) : (
        <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          <SortableList
            items={models}
            getId={(model) => model.id}
            onReorder={onReorder}
            layout="grid"
            renderItem={(model, { ref, style, handle, isDragging }) => {
              const color = colorMap.get(model.colorKey)
              return (
                <li
                  ref={ref}
                  style={style}
                  className={cn(
                    'group hover:border-line-strong overflow-hidden rounded-xl border border-line bg-canvas transition-colors',
                    isDragging && 'shadow-2xl ring-1 shadow-black/50 ring-accent/40',
                  )}
                >
                  <div className="relative">
                    <Thumb
                      src={model.image}
                      alt={`${model.code} ${color?.name.tr ?? model.colorKey}`}
                      paper
                      className={cn(
                        'aspect-[3/4] w-full rounded-none border-0',
                        !model.published && 'opacity-40',
                      )}
                    />
                    <div className="absolute top-2 left-2 rounded-lg bg-surface/90 backdrop-blur">
                      {handle}
                    </div>
                    {!model.published && (
                      <Badge tone="warning" className="absolute top-2 right-2">
                        <EyeOff className="size-3" /> Gizli
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{model.code}</p>
                      <p className="flex items-center gap-1.5 truncate text-xs text-subtle">
                        <span
                          className="border-line-strong size-2.5 shrink-0 rounded-full border"
                          style={{ backgroundColor: color?.hex }}
                          aria-hidden="true"
                        />
                        {color?.name.tr ?? model.colorKey}
                      </p>
                    </div>
                    <div className="flex shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDialog({ mode: 'edit', model })}
                        aria-label={`${model.code} modelini düzenle`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void onDelete(model)}
                        aria-label={`${model.code} modelini sil`}
                        className="hover:text-danger"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </li>
              )
            }}
          />
        </ul>
      )}

      {dialog && (
        <ModelDialog
          collectionId={collection.id}
          model={dialog.mode === 'edit' ? dialog.model : undefined}
          colors={colors}
          onClose={() => setDialog(null)}
        />
      )}
    </Card>
  )
}

function ModelDialog({
  collectionId,
  model,
  colors,
  onClose,
}: {
  collectionId: number
  model?: AdminModel
  colors: AdminColor[]
  onClose: () => void
}) {
  const save = useSaveModel(collectionId)
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ModelFormInput, unknown, ModelFormOutput>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: model
      ? {
          code: model.code,
          colorKey: model.colorKey,
          image: model.image,
          published: model.published,
        }
      : { code: '', colorKey: colors[0]?.key ?? '', image: '', published: true },
  })

  async function onSubmit(values: ModelFormOutput) {
    try {
      await save.mutateAsync({ ...values, id: model?.id })
      toast.success(model ? 'Model güncellendi' : 'Model eklendi')
      onClose()
    } catch (error) {
      if (!applyApiErrors(error, setError)) toast.error(errorMessage(error))
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={model ? `${model.code} modelini düzenle` : 'Yeni model'}
      description="Model adresi desen kodu ve renkten otomatik üretilir."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="model-form" loading={save.isPending}>
            {model ? 'Kaydet' : 'Modeli ekle'}
          </Button>
        </>
      }
    >
      <form id="model-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Desen kodu"
            error={errors.code?.message}
            hint="Büyük harf ve rakam, ör. 6055A"
          >
            {(props) => (
              <Input
                {...props}
                {...register('code', {
                  setValueAs: (value: string) => value.toUpperCase(),
                })}
                className="uppercase"
                autoFocus
              />
            )}
          </Field>
          <Field
            label="Renk"
            error={errors.colorKey?.message}
            hint={
              <>
                Listede yoksa{' '}
                <Link to="/colors" className="text-accent hover:underline">
                  renkler sayfasından
                </Link>{' '}
                ekleyin.
              </>
            }
          >
            {(props) => (
              <NativeSelect {...props} {...register('colorKey')}>
                {colors.map((color) => (
                  <option key={color.key} value={color.key}>
                    {color.name.tr} ({color.key})
                  </option>
                ))}
              </NativeSelect>
            )}
          </Field>
        </div>
        <Controller
          control={control}
          name="image"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted">Ürün fotoğrafı</p>
              <ImageField
                value={field.value}
                onChange={(url) => field.onChange(url ?? '')}
                paper
                invalid={!!fieldState.error}
              />
              {fieldState.error && (
                <p className="text-danger text-xs">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas p-3">
              <span>
                <span className="block text-sm font-semibold text-ink">Yayında</span>
                <span className="text-xs text-subtle">Kapalıyken model sitede görünmez.</span>
              </span>
              <Switch checked={!!field.value} onCheckedChange={field.onChange} label="Yayında" />
            </label>
          )}
        />
      </form>
    </Dialog>
  )
}
