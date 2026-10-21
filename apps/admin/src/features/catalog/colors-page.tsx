import { zodResolver } from '@hookform/resolvers/zod'
import { colorInputSchema, type AdminColor, type ColorInput } from '@karar-hali/shared'
import { Palette, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { RoleGate } from '@/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Table, TD, TH, THead, TR } from '@/components/ui/table'
import { useConfirm } from '@/components/ui/use-confirm'
import { applyApiErrors } from '@/lib/form-errors'
import { errorMessage, HttpError } from '@/lib/http'
import { useColors, useDeleteColor, useSaveColor } from './api'

type DialogState = { mode: 'create' } | { mode: 'edit'; color: AdminColor } | null

export function ColorsPage() {
  return (
    <RoleGate permission="catalog">
      <ColorsList />
    </RoleGate>
  )
}

function ColorsList() {
  const [dialog, setDialog] = useState<DialogState>(null)
  const { data, error, isPending, refetch } = useColors()
  const remove = useDeleteColor()
  const confirm = useConfirm()

  async function onDelete(color: AdminColor) {
    const ok = await confirm({
      title: `${color.name.tr} rengi silinsin mi?`,
      description: 'Bu rengi kullanan model varsa silme işlemi engellenir.',
      confirmLabel: 'Rengi sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(color.key)
      toast.success(`${color.name.tr} silindi`)
    } catch (error_) {
      toast.error(
        error_ instanceof HttpError && error_.status === 409
          ? 'Bu renk modellerde kullanılıyor. Önce o modellerin rengini değiştirin.'
          : errorMessage(error_),
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Renkler"
        description="Modellerde kullanılan renk paleti. Sitede renk filtresi ve model etiketlerinde görünür."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Renkler' }]}
        actions={
          <Button onClick={() => setDialog({ mode: 'create' })}>
            <Plus /> Yeni renk
          </Button>
        }
      />

      <Card>
        {error ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : isPending ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            icon={Palette}
            title="Henüz renk yok"
            description="Model eklemeden önce en az bir renk tanımlayın."
          />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH className="w-16">Renk</TH>
                <TH>Kod</TH>
                <TH>Türkçe</TH>
                <TH>English</TH>
                <TH>Hex</TH>
                <TH className="text-right">İşlemler</TH>
              </tr>
            </THead>
            <tbody>
              {data.map((color) => (
                <TR key={color.key}>
                  <TD>
                    <span
                      className="border-line-strong block size-8 rounded-lg border"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />
                  </TD>
                  <TD className="font-mono text-xs font-semibold text-muted">{color.key}</TD>
                  <TD className="font-semibold text-ink">{color.name.tr}</TD>
                  <TD className="text-muted">{color.name.en}</TD>
                  <TD className="font-mono text-xs text-subtle uppercase">{color.hex}</TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDialog({ mode: 'edit', color })}
                        aria-label={`${color.name.tr} rengini düzenle`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void onDelete(color)}
                        aria-label={`${color.name.tr} rengini sil`}
                        className="hover:text-danger"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {dialog && (
        <ColorDialog
          color={dialog.mode === 'edit' ? dialog.color : undefined}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}

function ColorDialog({ color, onClose }: { color?: AdminColor; onClose: () => void }) {
  const save = useSaveColor(color?.key)
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ColorInput>({
    resolver: zodResolver(colorInputSchema),
    defaultValues: color ?? { key: '', name: { tr: '', en: '' }, hex: '#8a6a4a' },
  })
  const hex = useWatch({ control, name: 'hex' })

  async function onSubmit(values: ColorInput) {
    try {
      await save.mutateAsync(values)
      toast.success(color ? 'Renk güncellendi' : 'Renk eklendi')
      onClose()
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        setError('key', { message: 'Bu kodla bir renk zaten var' })
      } else if (!applyApiErrors(error, setError)) {
        toast.error(errorMessage(error))
      }
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={color ? `${color.name.tr} rengini düzenle` : 'Yeni renk'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="color-form" loading={save.isPending}>
            {color ? 'Kaydet' : 'Rengi ekle'}
          </Button>
        </>
      }
    >
      <form id="color-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field
          label="Kod"
          error={errors.key?.message}
          hint={
            color ? 'Kod modellerde kullanıldığı için değiştirilemez.' : 'Büyük harf, ör. KAHVE'
          }
        >
          {(props) => (
            <Input
              {...props}
              {...register('key', { setValueAs: (value: string) => value.toUpperCase() })}
              readOnly={!!color}
              className="font-mono uppercase read-only:opacity-60"
              autoFocus={!color}
            />
          )}
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Türkçe ad" error={errors.name?.tr?.message}>
            {(props) => <Input {...props} {...register('name.tr')} autoFocus={!!color} />}
          </Field>
          <Field label="English name" error={errors.name?.en?.message}>
            {(props) => <Input {...props} {...register('name.en')} />}
          </Field>
        </div>
        <Field label="Renk" error={errors.hex?.message}>
          {(props) => (
            <div className="flex gap-2">
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#000000'}
                onChange={(event) =>
                  setValue('hex', event.target.value, { shouldValidate: true, shouldDirty: true })
                }
                aria-label="Renk seçici"
                className="h-10 w-14 shrink-0 cursor-pointer rounded-xl border border-line bg-canvas p-1"
              />
              <Input {...props} {...register('hex')} className="font-mono" placeholder="#RRGGBB" />
            </div>
          )}
        </Field>
      </form>
    </Dialog>
  )
}
