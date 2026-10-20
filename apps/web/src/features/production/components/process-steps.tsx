import { cn } from '@/lib/cn'

interface ProcessStepsProps {
  steps: readonly { title: string; text: string }[]
  tone?: 'dark' | 'light'
  className?: string
}

export function ProcessSteps({ steps, tone = 'dark', className }: ProcessStepsProps) {
  return (
    <ol
      className={cn(
        'grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3',
        tone === 'dark' ? 'bg-ink-900/10' : 'bg-cream-50/10',
        className,
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={cn('p-8', tone === 'dark' ? 'bg-cream-50' : 'bg-indigo-800')}
        >
          <span
            className={cn(
              'font-display text-4xl font-medium',
              tone === 'dark' ? 'text-madder-500' : 'text-madder-400',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3
            className={cn(
              'mt-4 text-xl font-medium',
              tone === 'dark' ? 'text-ink-950' : 'text-cream-50',
            )}
          >
            {step.title}
          </h3>
          <p
            className={cn(
              'mt-2 text-sm leading-relaxed',
              tone === 'dark' ? 'text-ink-700' : 'text-cream-200',
            )}
          >
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  )
}
