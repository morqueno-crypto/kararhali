import { cn } from '@/lib/cn'

const variants = {
  // İçten parlayan dolgu: hover'da soldan sağa geçen ışık şeridi.
  primary:
    'bg-accent text-on-accent hover:bg-accent-strong before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-ink/45 before:to-transparent before:transition-transform before:duration-700 before:ease-(--ease-out-expo) hover:before:translate-x-full',
  secondary: 'border border-line text-ink hover:border-ink/40 hover:bg-ink/5',
  ghost: 'text-ink hover:bg-ink/5',
} as const

export type ButtonVariant = keyof typeof variants

const base =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-(--ease-out-expo) disabled:pointer-events-none disabled:opacity-60 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-1'

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}
