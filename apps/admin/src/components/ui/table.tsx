import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full border-collapse text-left text-sm', className)} {...props} />
    </div>
  )
}

export function THead(props: ComponentProps<'thead'>) {
  return <thead {...props} />
}

export function TH({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'border-b border-line px-4 py-3 text-[11px] font-semibold tracking-wider whitespace-nowrap text-subtle uppercase',
        className,
      )}
      {...props}
    />
  )
}

export function TR({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-line/60 transition-colors last:border-0 hover:bg-raised/40',
        className,
      )}
      {...props}
    />
  )
}

export function TD({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-4 py-3 align-middle', className)} {...props} />
}
