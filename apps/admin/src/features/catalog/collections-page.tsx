import type { AdminCollectionListItem, CollectionCategory } from '@karar-hali/shared'
import { useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Layers, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { RoleGate } from '@/auth/role-gate'
import { Badge } from '@/components/ui/badge'
import { Button, buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { Input } from '@/components/ui/form-controls'
import { PageHeader } from '@/components/ui/page-header'
import { SortableList } from '@/components/ui/sortable'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { Thumb } from '@/components/ui/thumb'
import { useConfirm } from '@/components/ui/use-confirm'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { errorMessage } from '@/lib/http'
import {
  catalogKeys,
  useCollections,
  useDeleteCollection,
  usePatchCollection,
  useReorderCollections,
} from './api'
import { categoryLabels } from './labels'

type CategoryFilter = CollectionCategory | 'all'

export function CollectionsPage() {
  return (
    <RoleGate permission="catalog">
      <CollectionsList />
    </RoleGate>
  )
}

function CollectionsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = (searchParams.get('category') ?? 'all') as CategoryFilter
  const { data, error, isPending, refetch } = useCollections()
  const queryClient = useQueryClient()
  const patch = usePatchCollection()
  const reorder = useReorderCollections()
  const remove = useDeleteCollection()
  const confirm = useConfirm()

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const filtered = (data ?? []).filter((item) => {
    const matchesQuery =
      !query ||
      item.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR')) ||
      item.slug.includes(query.toLowerCase())
    return matchesQuery && (category === 'all' || item.category === category)
  })
  const isFiltered = !!query || category !== 'all'

  function onReorder(items: AdminCollectionListItem[]) {
    // İyimser güncelleme: liste anında yeni sırayla görünür, sunucu yanıtı sonra senkronlar.
    queryClient.setQueryData(catalogKeys.collections, items)
    reorder.mutate(
      items.map((item) => item.id),
      { onError: (error_) => toast.error(errorMessage(error_)) },
    )
  }

  async function toggle(item: AdminCollectionListItem, field: 'published' | 'featured') {
    try {
      await patch.mutateAsync({ id: item.id, [field]: !item[field] })
      toast.success(
        field === 'published'
          ? item.published
            ? `${item.name} yayından kaldırıldı`
            : `${item.name} yayında`
          : item.featured
            ? `${item.name} öne çıkanlardan çıkarıldı`
            : `${item.name} öne çıkarıldı`,
      )
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  async function onDelete(item: AdminCollectionListItem) {
    const ok = await confirm({
      title: `${item.name} silinsin mi?`,
      description: `Koleksiyon ve içindeki ${item.modelCount} model kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      confirmLabel: 'Koleksiyonu sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(item.id)
      toast.success(`${item.name} silindi`)
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  const counts = {
    all: data?.length ?? 0,
    carpet: data?.filter((item) => item.category === 'carpet').length ?? 0,
    roll: data?.filter((item) => item.category === 'roll').length ?? 0,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Koleksiyonlar"
        description="Halı ve rulo kesim koleksiyonları. Sürükleyerek sitedeki sırayı değiştirin."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Koleksiyonlar' }]}
        actions={
          <Link to="/collections/new" className={buttonClass('primary')}>
            <Plus /> Yeni koleksiyon
          </Link>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={category} onValueChange={(value) => setParam('category', value)}>
            <TabsList
              items={[
                { value: 'all', label: `Tümü · ${counts.all}` },
                { value: 'carpet', label: `Halı · ${counts.carpet}` },
                { value: 'roll', label: `Rulo kesim · ${counts.roll}` },
              ]}
            />
          </Tabs>
          <div className="relative sm:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setParam('q', event.target.value)}
              placeholder="Ad veya adres ile ara…"
              aria-label="Koleksiyon ara"
              className="pl-9"
            />
          </div>
        </div>

        {error ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : isPending ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={isFiltered ? 'Eşleşen koleksiyon yok' : 'Henüz koleksiyon yok'}
            description={isFiltered ? 'Aramayı veya kategori filtresini değiştirin.' : undefined}
            action={
              !isFiltered && (
                <Link to="/collections/new" className={buttonClass('primary')}>
                  <Plus /> İlk koleksiyonu ekle
                </Link>
              )
            }
          />
        ) : (
          <div role="table" aria-label="Koleksiyonlar">
            <div
              role="row"
              className="hidden grid-cols-[2rem_3.5rem_1fr_7rem_5rem_6rem_6rem_7.5rem] items-center gap-4 border-b border-line px-4 py-3 text-[11px] font-semibold tracking-wider text-subtle uppercase xl:grid"
            >
              <span role="columnheader" className="sr-only">
                Sıra
              </span>
              <span role="columnheader" className="sr-only">
                Kapak
              </span>
              <span role="columnheader">Koleksiyon</span>
              <span role="columnheader">Kategori</span>
              <span role="columnheader">Model</span>
              <span role="columnheader">Öne çıkan</span>
              <span role="columnheader">Yayında</span>
              <span role="columnheader" className="text-right">
                İşlemler
              </span>
            </div>
            <SortableList
              items={filtered}
              getId={(item) => item.id}
              onReorder={onReorder}
              disabled={isFiltered}
              renderItem={(item, { ref, style, handle, isDragging }) => (
                <div
                  ref={ref}
                  style={style}
                  role="row"
                  className={cn(
                    'grid grid-cols-[2rem_3.5rem_1fr_auto] items-center gap-4 border-b border-line/60 bg-surface px-4 py-3 last:border-0 xl:grid-cols-[2rem_3.5rem_1fr_7rem_5rem_6rem_6rem_7.5rem]',
                    isDragging && 'rounded-xl shadow-2xl ring-1 shadow-black/50 ring-accent/40',
                  )}
                >
                  <span role="cell">{handle}</span>
                  <span role="cell">
                    <Thumb src={item.coverImage} className="size-12" />
                  </span>
                  <div role="cell" className="min-w-0">
                    <Link
                      to={`/collections/${item.id}`}
                      className="font-semibold text-ink hover:text-accent"
                    >
                      {item.name}
                    </Link>
                    <p className="truncate text-xs text-subtle">
                      /{item.slug}
                      <span className="xl:hidden">
                        {' · '}
                        {categoryLabels[item.category]} · {item.modelCount} model
                        {!item.published && ' · gizli'}
                      </span>
                    </p>
                  </div>
                  <span role="cell" className="hidden xl:block">
                    <Badge tone={item.category === 'carpet' ? 'accent' : 'info'}>
                      {categoryLabels[item.category]}
                    </Badge>
                  </span>
                  <span role="cell" className="hidden text-muted tabular-nums xl:block">
                    {item.modelCount}
                  </span>
                  <span role="cell" className="hidden xl:block">
                    <button
                      type="button"
                      onClick={() => void toggle(item, 'featured')}
                      aria-pressed={item.featured}
                      aria-label={item.featured ? 'Öne çıkanlardan çıkar' : 'Öne çıkar'}
                      className="rounded-md p-1 transition-colors hover:bg-raised"
                    >
                      <Star
                        className={cn(
                          'size-4',
                          item.featured ? 'fill-accent text-accent' : 'text-subtle',
                        )}
                      />
                    </button>
                  </span>
                  <span role="cell" className="hidden xl:block">
                    <Switch
                      checked={item.published}
                      onCheckedChange={() => void toggle(item, 'published')}
                      label={`${item.name} yayında`}
                    />
                  </span>
                  <div role="cell" className="flex justify-end gap-1">
                    <a
                      href={`${env.VITE_SITE_URL}/tr/koleksiyonlar/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Sitede görüntüle"
                      title="Sitede görüntüle"
                      className={buttonClass('ghost', 'icon')}
                    >
                      <ExternalLink />
                    </a>
                    <Link
                      to={`/collections/${item.id}`}
                      aria-label="Düzenle"
                      title="Düzenle"
                      className={buttonClass('ghost', 'icon')}
                    >
                      <Pencil />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void onDelete(item)}
                      aria-label="Sil"
                      title="Sil"
                      className="hover:text-danger"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
