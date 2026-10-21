import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumb?: { label: string; to?: string }[]
  actions?: ReactNode
}

/** Sayfa üstü: kırıntı yol, başlık, açıklama ve sağda eylemler (referanstaki "hero" kartı). */
export function PageHeader({ title, description, breadcrumb, actions }: PageHeaderProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-7">
      <div
        className="absolute -top-24 -right-16 -z-10 size-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      {breadcrumb && (
        <nav aria-label="Konum" className="mb-2 flex items-center gap-1 text-xs text-subtle">
          {breadcrumb.map((item, index) => (
            <span key={item.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
              {item.to ? (
                <Link to={item.to} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-muted">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
