import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong shadow-[0_0_0_1px] shadow-accent/30',
  secondary: 'border border-line bg-surface text-ink hover:border-line-strong hover:bg-raised',
  ghost: 'text-muted hover:bg-raised hover:text-ink',
  danger: 'border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20',
} as const

const sizes = {
  sm: 'h-8 gap-1.5 rounded-lg px-3 text-xs',
  md: 'h-10 gap-2 rounded-xl px-4 text-sm',
  icon: 'size-9 rounded-lg',
} as const

export type ButtonVariant = keyof typeof variants

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: keyof typeof sizes = 'md',
  className?: string,
) {
  return cn(
    'inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
    variants[variant],
    sizes[size],
    className,
  )
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: keyof typeof sizes
  loading?: boolean
}

export function Button({
  variant,
  size,
  loading,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClass(variant, size, className)}
      {...props}
    >
      {loading && <LoaderCircle className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
