import { use } from 'react'
import { LenisContext } from './lenis-context'

export function useLenis() {
  return use(LenisContext)
}
