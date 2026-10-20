import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8', className)}>
      <rect width="32" height="32" rx="6" className="fill-madder-600" />
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="2"
        fill="none"
        strokeWidth="1.5"
        className="stroke-cream-50"
      />
      <path d="M16 9l7 7-7 7-7-7z" className="fill-cream-50" />
      <path d="M16 13l3 3-3 3-3-3z" className="fill-madder-600" />
    </svg>
  )
}
