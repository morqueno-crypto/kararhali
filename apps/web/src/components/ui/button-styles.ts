import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong',
  secondary: 'border border-line text-ink hover:border-ink/40 hover:bg-ink/5',
  ghost: 'text-ink hover:bg-ink/5',
} as const

export type ButtonVariant = keyof typeof variants

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60'

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}
