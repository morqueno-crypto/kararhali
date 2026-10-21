import { Check, ImagePlus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Input } from '@/components/ui/form-controls'
import { Pagination } from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { Thumb } from '@/components/ui/thumb'
import { cn } from '@/lib/cn'
import { useMediaPage } from './api'
import { Dropzone } from './dropzone'

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  /** Mevcut değer (seçili gösterilir) */
  value?: string
}

const PAGE_SIZE = 18

/** Görsel seçici: kütüphaneden seç, yeni yükle veya bir adres yapıştır. */
export function MediaPicker({ open, onOpenChange, onSelect, value }: MediaPickerProps) {
  const [tab, setTab] = useState('library')
  const [page, setPage] = useState(1)
  const [url, setUrl] = useState('')
  const { data, error, isPending, refetch } = useMediaPage(page, PAGE_SIZE)

  function choose(selected: string) {
    onSelect(selected)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Görsel seç"
      description="Kütüphaneden seçin, yeni görsel yükleyin veya bir adres yapıştırın."
      size="lg"
    >
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          items={[
            { value: 'library', label: 'Kütüphane' },
            { value: 'upload', label: 'Yükle' },
            { value: 'url', label: 'Adres' },
          ]}
        />

        <TabsContent value="library" className="mt-4">
          {error ? (
            <QueryError error={error} onRetry={() => void refetch()} />
          ) : isPending ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {Array.from({ length: 12 }, (_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <EmptyState
              icon={ImagePlus}
              title="Kütüphane boş"
              description="“Yükle” sekmesinden ilk görselinizi ekleyin."
            />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {data.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => choose(item.url)}
                    title={item.filename}
                    className={cn(
                      'group relative aspect-square overflow-hidden rounded-xl border-2 transition-colors',
                      value === item.url
                        ? 'border-accent'
                        : 'hover:border-line-strong border-transparent',
                    )}
                  >
                    <Thumb
                      src={item.url}
                      alt={item.alt}
                      paper
                      className="size-full rounded-none border-0"
                    />
                    {value === item.url && (
                      <span className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-accent text-on-accent">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={data.total}
                onPageChange={setPage}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Dropzone multiple={false} onUploaded={choose} />
        </TabsContent>

        <TabsContent value="url" className="mt-4 space-y-3">
          <Input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://… veya /uploads/…"
            aria-label="Görsel adresi"
          />
          {url && <Thumb src={url} paper className="h-40 w-full" />}
          <div className="flex justify-end">
            <Button
              disabled={!/^(https?:\/\/|\/uploads\/)/.test(url.trim())}
              onClick={() => choose(url.trim())}
            >
              Bu adresi kullan
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Dialog>
  )
}
