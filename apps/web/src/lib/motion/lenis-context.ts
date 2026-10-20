import type Lenis from 'lenis'
import { createContext } from 'react'

/** Aktif Lenis örneği; reduced-motion açıksa veya henüz oluşmadıysa null. */
export const LenisContext = createContext<Lenis | null>(null)
