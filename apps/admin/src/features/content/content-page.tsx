import { contentKeys } from '@karar-hali/shared'
import { ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router'
import { RoleGate } from '@/auth/role-gate'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { QueryError, Skeleton } from '@/components/ui/feedback'
import { PageHeader } from '@/components/ui/page-header'
import { formatRelative } from '@/lib/format'
import { useContentList } from './api'
import { blockDefs, blockGroups } from './blocks'

export function ContentPage() {
  return (
    <RoleGate permission="content">
      <ContentList />
    </RoleGate>
  )
}

function ContentList() {
  const { data, error, isPending, refetch } = useContentList()
  const updatedAt = new Map(data?.map((item) => [item.key, item.updatedAt]))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sayfa içerikleri"
        description="Sitedeki tüm başlık, metin ve görseller. Her bölüm Türkçe ve İngilizce olarak ayrı düzenlenir."
        breadcrumb={[{ label: 'Panel', to: '/' }, { label: 'İçerikler' }]}
      />

      {error ? (
        <Card>
          <QueryError error={error} onRetry={() => void refetch()} />
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {blockGroups.map((group) => {
            const keys = contentKeys.filter((key) => blockDefs[key].group === group)
            return (
              <Card key={group} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h2 className="text-base font-bold text-ink">{group}</h2>
                  <span className="text-xs text-subtle">{keys.length} bölüm</span>
                </div>
                <ul>
                  {keys.map((key) => {
                    const def = blockDefs[key]
                    const updated = updatedAt.get(key)
                    return (
                      <li key={key} className="border-b border-line/60 last:border-0">
                        <Link
                          to={`/content/${key}`}
                          className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-raised/50"
                        >
                          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-raised text-subtle transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                            <FileText className="size-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">
                              {def.title}
                            </span>
                            <span className="block truncate text-xs text-subtle">
                              {def.description}
                            </span>
                          </span>
                          {isPending ? (
                            <Skeleton className="h-4 w-20" />
                          ) : updated ? (
                            <span className="hidden text-xs whitespace-nowrap text-subtle sm:block">
                              {formatRelative(updated)}
                            </span>
                          ) : (
                            <Badge tone="warning">Boş</Badge>
                          )}
                          <ChevronRight className="size-4 text-subtle transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
