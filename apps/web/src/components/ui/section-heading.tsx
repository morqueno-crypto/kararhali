import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="text-xs font-medium tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-4 text-3xl font-semibold text-ink sm:text-5xl">{title}</h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      )}
    </div>
  )
}
