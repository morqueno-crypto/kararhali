import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect, useState, type ReactNode } from 'react'
import { LenisContext } from './lenis-context'
import { useReducedMotion } from './use-media-query'

/**
 * Lenis ile yumuşak kaydırma. Reduced-motion açıksa hiç oluşturulmaz (native scroll).
 * GSAP'a bağımlı değildir; ScrollTrigger senkronu GSAP kullanan sayfada `useScrollTriggerSync` ile kurulur.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return
    const instance = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 })
    // Lenis harici bir sistemdir; örneği context üzerinden paylaşmak için state'e alınır.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance)
    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext value={lenis}>{children}</LenisContext>
}
