import type { MediaItem } from '@karar-hali/shared'
import { Copy, Images, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { RoleGate } from '@/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Field, Input } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { Thumb } from '@/components/ui/thumb'
import { useConfirm } from '@/components/ui/use-confirm'
import { formatBytes, formatRelative } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useDeleteMedia, useMediaPage, useUpdateMedia } from './api'
import { Dropzone } from './dropzone'

const PAGE_SIZE = 24

export function MediaPage() {
  return (
    <RoleGate permission="media">
      <MediaLibrary />
    </RoleGate>
  )
}

function MediaLibrary() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<MediaItem | null>(null)
  const { data, error, isPending, refetch } = useMediaPage(page, PAGE_SIZE)
  const remove = useDeleteMedia()
  const confirm = useConfirm()

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url)
      toast.success('Adres kopyalandı')
    } catch {
      toast.error('Kopyalanamadı')
    }
  }

  async function onDelete(item: MediaItem) {
    const ok = await confirm({
      title: 'Görsel silinsin mi?',
      description: `“${item.filename}” kalıcı olarak silinecek. Bu görseli kullanan içerik veya modeller varsa sitede görünmez olur.`,
      confirmLabel: 'Sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(item.id)
      toast.success('Görsel silindi')
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medya"
        description="Sitede kullanılan görseller. Yüklediğiniz görselleri koleksiyon, model ve içerik formlarında seçebilirsiniz."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Medya' }]}
      />

      <Dropzone />

      <Card>
        {error ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : isPending ? (
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={Images}
            title="Henüz görsel yok"
            description="Yukarıdaki alana sürükleyerek ilk görsellerinizi yükleyin."
          />
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 xl:grid-cols-6">
              {data.items.map((item) => (
                <li
                  key={item.id}
                  className="group hover:border-line-strong overflow-hidden rounded-xl border border-line bg-canvas transition-colors"
                >
                  <div className="relative">
                    <Thumb
                      src={item.url}
                      alt={item.alt}
                      paper
                      className="aspect-square w-full rounded-none border-0"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-canvas/90 to-transparent p-2 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => void copyUrl(item)}
                        aria-label="Adresi kopyala"
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setEditing(item)}
                        aria-label="Açıklamayı düzenle"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="danger"
                        size="icon"
                        onClick={() => void onDelete(item)}
                        aria-label="Sil"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-semibold text-ink" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[11px] text-subtle">
                      {formatBytes(item.size)} · {formatRelative(item.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={data.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {editing && <AltDialog item={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

function AltDialog({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const [alt, setAlt] = useState(item.alt)
  const update = useUpdateMedia()

  async function save() {
    try {
      await update.mutateAsync({ id: item.id, alt })
      toast.success('Açıklama kaydedildi')
      onClose()
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="Görsel açıklaması"
      description="Görme engelli ziyaretçiler ve arama motorları için kısa bir açıklama yazın."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Vazgeç
          </Button>
          <Button loading={update.isPending} onClick={() => void save()}>
            Kaydet
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Thumb src={item.url} paper className="h-48 w-full" />
        <Field label="Açıklama (alt metin)">
          {(props) => (
            <Input
              {...props}
              value={alt}
              maxLength={300}
              onChange={(event) => setAlt(event.target.value)}
            />
          )}
        </Field>
      </div>
    </Dialog>
  )
}
