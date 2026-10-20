import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-madder-600 text-cream-50 hover:bg-madder-700',
  secondary: 'border border-ink-900/20 text-ink-900 hover:border-ink-900 hover:bg-ink-900/5',
  light: 'bg-cream-50 text-ink-950 hover:bg-cream-200',
} as const

export type ButtonVariant = keyof typeof variants

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60'

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}
