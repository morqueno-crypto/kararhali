import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/** "1–20 / 57" + sayfa düğmeleri (aktif sayfa altın). */
export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (total === 0) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  const visible = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  )

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs text-subtle">
      <span className="tabular-nums">
        {from}–{to} / {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Önceki sayfa"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-line hover:bg-raised disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        {visible.map((p, index) => (
          <span key={p} className="flex items-center gap-1">
            {index > 0 && p - (visible[index - 1] ?? p) > 1 && <span className="px-1">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-lg font-semibold tabular-nums',
                p === page ? 'bg-accent text-on-accent' : 'border border-line hover:bg-raised',
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Sonraki sayfa"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-line hover:bg-raised disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
