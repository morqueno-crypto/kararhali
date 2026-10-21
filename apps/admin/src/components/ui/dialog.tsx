import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** sm: 28rem · md: 36rem · lg: 52rem · xl: 72rem */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  footer?: ReactNode
}

const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-6xl' }

/** Erişilebilir modal (odak tuzağı, Esc, arka plan tıklaması Radix tarafından yönetilir). */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  children,
  footer,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="animate-fade-in fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className={cn(
            'animate-scale-in fixed top-1/2 left-1/2 z-50 flex max-h-[min(90dvh,56rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-line bg-surface shadow-2xl shadow-black/50 focus:outline-none',
            widths[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div>
              <DialogPrimitive.Title className="font-display text-lg font-bold text-ink">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-0.5 text-xs text-subtle">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">
                  {title}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              className="rounded-lg p-1.5 text-subtle transition-colors hover:bg-raised hover:text-ink"
              aria-label="Kapat"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
