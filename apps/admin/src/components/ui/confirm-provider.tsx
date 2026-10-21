import { AlertDialog } from 'radix-ui'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { buttonClass } from './button'
import { ConfirmContext, type ConfirmOptions } from './confirm-context'

/** `const confirm = useConfirm(); if (await confirm({...})) ...` için onay penceresi sağlayıcısı. */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<(value: boolean) => void>(undefined)

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  function close(result: boolean) {
    resolver.current?.(result)
    resolver.current = undefined
    setOptions(null)
  }

  return (
    <ConfirmContext value={confirm}>
      {children}
      <AlertDialog.Root open={options !== null} onOpenChange={(open) => !open && close(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="animate-fade-in fixed inset-0 z-50 bg-canvas/80 backdrop-blur-sm" />
          <AlertDialog.Content className="animate-scale-in fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 shadow-2xl shadow-black/50">
            <AlertDialog.Title className="font-display text-lg font-bold text-ink">
              {options?.title}
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm leading-relaxed text-muted">
              {options?.description}
            </AlertDialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <AlertDialog.Cancel className={buttonClass('secondary')} onClick={() => close(false)}>
                Vazgeç
              </AlertDialog.Cancel>
              <AlertDialog.Action
                className={buttonClass(options?.destructive ? 'danger' : 'primary')}
                onClick={() => close(true)}
              >
                {options?.confirmLabel ?? 'Onayla'}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext>
  )
}
