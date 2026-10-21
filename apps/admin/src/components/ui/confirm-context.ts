import { createContext } from 'react'

export interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  /** Silme gibi geri alınamaz işlemler kırmızı gösterilir */
  destructive?: boolean
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

export const ConfirmContext = createContext<ConfirmFn | null>(null)
