import type { ReactNode } from 'react'
import { Emphasis } from '@/components/ui/emphasis'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  /** Başlık içinde vurgulanacak parça (i18n'den). */
  titleAccent?: string
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Reveal
          as="p"
          variant="tracking"
          className="text-xs font-medium tracking-[0.25em] text-accent uppercase"
        >
          {eyebrow}
        </Reveal>
      )}
      <h2 className="mt-4 overflow-hidden pb-[0.12em] text-3xl font-semibold text-ink sm:text-5xl">
        <Reveal as="span" variant="mask" className="block">
          <Emphasis text={title} accent={titleAccent} />
        </Reveal>
      </h2>
      {description && (
        <Reveal
          as="p"
          variant="up"
          delay={150}
          className="mt-5 text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </Reveal>
      )}
    </div>
  )
}
