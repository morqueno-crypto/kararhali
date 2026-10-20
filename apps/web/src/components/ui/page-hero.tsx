import type { ReactNode } from 'react'
import { Container } from '@/components/ui/container'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-ink-900/10 bg-cream-100">
      <Container className="py-16 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.2em] text-madder-600 uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-medium text-ink-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-700">{description}</p>
        )}
      </Container>
    </section>
  )
}
