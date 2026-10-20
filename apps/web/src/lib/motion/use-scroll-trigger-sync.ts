import { useEffect } from 'react'
import { ScrollTrigger } from './gsap'
import { useLenis } from './use-lenis'

/**
 * GSAP kullanan sayfada bir kez çağrılır:
 * - Lenis kaydırmasını ScrollTrigger'a bildirir,
 * - fontlar ve görseller yüklenince tetikleyici konumlarını yeniden hesaplar,
 * - sayfadan çıkarken kalan tetikleyici bırakmaz (her bileşen kendi useGSAP context'ini temizler).
 */
export function useScrollTriggerSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const update = () => ScrollTrigger.update()
    const unsubscribe = lenis.on('scroll', update)
    return () => unsubscribe()
  }, [lenis])

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    const timer = window.setTimeout(refresh, 600)
    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(timer)
    }
  }, [])
}
