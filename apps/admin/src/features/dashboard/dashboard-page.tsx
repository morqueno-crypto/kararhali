import { Images, Inbox, Layers, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router'
import { can } from '@/auth/permissions'
import { useUser } from '@/auth/use-user'
import { Card, CardHeader } from '@/components/ui/card'
import { QueryError, Skeleton } from '@/components/ui/feedback'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { formatRelative, formatShortDate } from '@/lib/format'
import { useDashboard } from './api'

export function DashboardPage() {
  const user = useUser()
  const { data, error, refetch, isPending } = useDashboard()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hoş geldiniz, ${user.name.split(' ')[0]}`}
        description="Sitenin genel durumu ve son hareketler."
      />

      {error ? (
        <Card>
          <QueryError error={error} onRetry={() => void refetch()} />
        </Card>
      ) : isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Koleksiyonlar"
              value={data.collectionCount}
              icon={Layers}
              to="/collections"
              footnote={`${data.collectionsByCategory.carpet} halı · ${data.collectionsByCategory.roll} rulo`}
            />
            <StatCard label="Modeller" value={data.modelCount} icon={LayoutGrid} tone="info" />
            <StatCard
              label="Yeni mesajlar"
              value={data.newMessages}
              icon={Inbox}
              tone={data.newMessages > 0 ? 'warning' : 'success'}
              to={can(user, 'messages') ? '/messages' : undefined}
            />
            <StatCard
              label="Medya"
              value={data.mediaCount}
              icon={Images}
              tone="success"
              to="/media"
            />
          </div>

          <Card>
            <CardHeader title="Son 14 gün" description="Günlük iletişim talepleri" />
            <div className="flex h-40 items-end gap-1.5 p-5">
              {data.messagesByDay.map((day) => {
                const max = Math.max(1, ...data.messagesByDay.map((d) => d.count))
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      title={`${formatShortDate(day.date)}: ${day.count}`}
                      className="w-full rounded-md bg-accent/80"
                      style={{ height: `${Math.max(4, (day.count / max) * 100)}%` }}
                    />
                  </div>
                )
              })}
            </div>
          </Card>

          {can(user, 'messages') && data.recentMessages.length > 0 && (
            <Card>
              <CardHeader title="Son mesajlar" />
              <ul className="divide-y divide-line p-2">
                {data.recentMessages.map((message) => (
                  <li key={message.id}>
                    <Link
                      to={`/messages?status=all&id=${message.id}`}
                      className="flex justify-between gap-4 rounded-xl px-3 py-3 hover:bg-raised"
                    >
                      <span className="font-semibold text-ink">{message.name}</span>
                      <span className="text-xs text-subtle">
                        {formatRelative(message.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
