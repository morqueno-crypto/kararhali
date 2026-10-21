import { use } from 'react'
import { ConfirmContext } from './confirm-context'

export function useConfirm() {
  const confirm = use(ConfirmContext)
  if (!confirm) throw new Error('useConfirm, ConfirmProvider içinde kullanılmalı')
  return confirm
}
