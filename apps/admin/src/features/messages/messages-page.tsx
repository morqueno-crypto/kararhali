import type { ContactMessage, MessageStatus } from '@karar-hali/shared'
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Inbox,
  Mail,
  MailOpen,
  Reply,
  Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { RoleGate } from '@/auth/role-gate'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Button, buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState, QueryError, Skeleton } from '@/components/ui/feedback'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { useConfirm } from '@/components/ui/use-confirm'
import { cn } from '@/lib/cn'
import { formatDateTime, formatRelative, initials } from '@/lib/format'
import { errorMessage } from '@/lib/http'
import { useDeleteMessage, useMessages, useSetMessageStatus } from './api'

type StatusFilter = MessageStatus | 'all'
const PAGE_SIZE = 20

const statusMeta: Record<MessageStatus, { label: string; tone: BadgeTone }> = {
  new: { label: 'Yeni', tone: 'accent' },
  read: { label: 'Okundu', tone: 'neutral' },
  archived: { label: 'Arşiv', tone: 'info' },
}

export function MessagesPage() {
  return (
    <RoleGate permission="messages">
      <Messages />
    </RoleGate>
  )
}

function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = (searchParams.get('status') ?? 'new') as StatusFilter
  const page = Number(searchParams.get('page') ?? 1)
  const deepLinkId = Number(searchParams.get('id') ?? 0)
  // Seçili mesaj ayrıca tutulur: "Yeni" sekmesinde okundu işaretlenince listeden düşse de açık kalır.
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const { data, error, isPending, refetch } = useMessages(status, page)
  const setStatus = useSetMessageStatus()
  const remove = useDeleteMessage()
  const confirm = useConfirm()
  const markedRef = useRef(new Set<number>())

  function update(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(next)) {
      if (value === null) params.delete(key)
      else params.set(key, value)
    }
    setSearchParams(params, { replace: true })
  }

  // Panelden gelen bağlantı (?id=) ile açılan mesaj listeden bulunur
  const current =
    selected ?? (deepLinkId ? (data?.items.find((item) => item.id === deepLinkId) ?? null) : null)

  // Açılan yeni mesaj otomatik okundu olur (her mesaj için bir kez)
  const { mutate: mutateStatus } = setStatus
  useEffect(() => {
    if (!current || current.status !== 'new' || markedRef.current.has(current.id)) return
    markedRef.current.add(current.id)
    mutateStatus(
      { id: current.id, status: 'read' },
      { onSuccess: ({ message }) => setSelected(message) },
    )
  }, [current, mutateStatus])

  async function changeStatus(message: ContactMessage, next: MessageStatus) {
    try {
      const result = await setStatus.mutateAsync({ id: message.id, status: next })
      setSelected(result.message)
      toast.success(
        next === 'archived'
          ? 'Mesaj arşivlendi'
          : next === 'new'
            ? 'Okunmadı olarak işaretlendi'
            : 'Mesaj gelen kutusuna taşındı',
      )
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  async function onDelete(message: ContactMessage) {
    const ok = await confirm({
      title: 'Mesaj silinsin mi?',
      description: `${message.name} kişisinden gelen “${message.subject}” mesajı kalıcı olarak silinecek.`,
      confirmLabel: 'Sil',
      destructive: true,
    })
    if (!ok) return
    try {
      await remove.mutateAsync(message.id)
      setSelected(null)
      update({ id: null })
      toast.success('Mesaj silindi')
    } catch (error_) {
      toast.error(errorMessage(error_))
    }
  }

  function open(message: ContactMessage) {
    setSelected(message)
    update({ id: String(message.id) })
  }

  function close() {
    setSelected(null)
    update({ id: null })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mesajlar"
        description="Sitedeki iletişim formundan gelen mesajlar. Açtığınız yeni mesajlar okundu olarak işaretlenir."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'Mesajlar' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(20rem,26rem)_1fr]">
        <Card className={cn('flex flex-col overflow-hidden', current && 'hidden lg:flex')}>
          <div className="border-b border-line p-4">
            <Tabs value={status} onValueChange={(value) => update({ status: value, page: null })}>
              <TabsList
                className="w-full [&>button]:flex-1 [&>button]:justify-center"
                items={[
                  { value: 'new', label: 'Yeni' },
                  { value: 'read', label: 'Okunan' },
                  { value: 'archived', label: 'Arşiv' },
                  { value: 'all', label: 'Tümü' },
                ]}
              />
            </Tabs>
          </div>
          {error ? (
            <QueryError error={error} onRetry={() => void refetch()} />
          ) : isPending ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={status === 'new' ? 'Yeni mesaj yok' : 'Bu klasör boş'}
              description={
                status === 'new'
                  ? 'Her şey okundu. İletişim formundan gelen mesajlar burada görünür.'
                  : undefined
              }
            />
          ) : (
            <>
              <ul className="flex-1 divide-y divide-line/60">
                {data.items.map((message) => (
                  <li key={message.id}>
                    <button
                      type="button"
                      onClick={() => open(message)}
                      aria-current={current?.id === message.id ? 'true' : undefined}
                      className={cn(
                        'flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-raised/50',
                        current?.id === message.id &&
                          'bg-accent/5 shadow-[inset_2px_0] shadow-accent',
                      )}
                    >
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-raised text-xs font-bold text-muted">
                        {initials(message.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              'truncate text-sm',
                              message.status === 'new'
                                ? 'font-bold text-ink'
                                : 'font-medium text-muted',
                            )}
                          >
                            {message.name}
                          </span>
                          <span className="shrink-0 text-[11px] text-subtle">
                            {formatRelative(message.createdAt)}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'block truncate text-xs',
                            message.status === 'new' ? 'text-ink' : 'text-subtle',
                          )}
                        >
                          {message.subject}
                        </span>
                        <span className="block truncate text-xs text-subtle">
                          {message.message}
                        </span>
                      </span>
                      {message.status === 'new' && (
                        <span
                          className="mt-1.5 size-2 shrink-0 rounded-full bg-accent"
                          aria-label="okunmadı"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-line">
                <Pagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={data.total}
                  onPageChange={(next) => update({ page: String(next) })}
                />
              </div>
            </>
          )}
        </Card>

        <Card className={cn('min-h-[28rem]', !current && 'hidden lg:block')}>
          {current ? (
            <MessageDetail
              message={current}
              busy={setStatus.isPending || remove.isPending}
              onBack={close}
              onStatus={(next) => void changeStatus(current, next)}
              onDelete={() => void onDelete(current)}
            />
          ) : (
            <EmptyState
              icon={Mail}
              title="Bir mesaj seçin"
              description="Ayrıntıları görmek için soldaki listeden bir mesaja tıklayın."
            />
          )}
        </Card>
      </div>
    </div>
  )
}

function MessageDetail({
  message,
  busy,
  onBack,
  onStatus,
  onDelete,
}: {
  message: ContactMessage
  busy: boolean
  onBack: () => void
  onStatus: (status: MessageStatus) => void
  onDelete: () => void
}) {
  const reply = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`
  const meta = statusMeta[message.status]

  return (
    <article className="flex h-full flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
          <ArrowLeft /> Liste
        </Button>
        <Badge tone={meta.tone} dot>
          {meta.label}
        </Badge>
        <div className="flex flex-wrap gap-1">
          {message.status === 'archived' ? (
            <Button variant="ghost" size="sm" onClick={() => onStatus('read')} disabled={busy}>
              <ArchiveRestore /> Gelen kutusuna taşı
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatus('new')}
                disabled={busy || message.status === 'new'}
              >
                <MailOpen /> Okunmadı yap
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatus('archived')}
                disabled={busy}
              >
                <Archive /> Arşivle
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            disabled={busy}
            className="hover:text-danger"
          >
            <Trash2 /> Sil
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 px-5 py-6">
        <div>
          <h2 className="text-xl font-bold text-ink">{message.subject}</h2>
          <p className="mt-1 text-xs text-subtle">{formatDateTime(message.createdAt)}</p>
        </div>

        <dl className="grid gap-4 rounded-xl border border-line bg-canvas p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-subtle">Gönderen</dt>
            <dd className="font-semibold text-ink">{message.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">E-posta</dt>
            <dd>
              <a
                href={`mailto:${message.email}`}
                className="font-semibold text-accent hover:underline"
              >
                {message.email}
              </a>
            </dd>
          </div>
          {message.company && (
            <div>
              <dt className="text-xs text-subtle">Firma</dt>
              <dd className="text-ink">{message.company}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-subtle">Site dili</dt>
            <dd className="text-ink">{message.locale === 'en' ? 'English' : 'Türkçe'}</dd>
          </div>
        </dl>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{message.message}</p>
      </div>

      <footer className="border-t border-line px-5 py-4">
        <a href={reply} className={buttonClass('primary')}>
          <Reply /> E-posta ile yanıtla
        </a>
      </footer>
    </article>
  )
}
