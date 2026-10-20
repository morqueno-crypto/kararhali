import { useEffect, useState, type RefObject } from 'react'

interface InViewOptions {
  /** Görünür olduktan sonra takibi bırak (giriş animasyonları için). */
  once?: boolean
  rootMargin?: string
  threshold?: number
}

/** Eleman görünüm alanına girdi mi? IntersectionObserver yoksa hemen true döner. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, rootMargin = '0px 0px -10% 0px', threshold = 0.15 }: InViewOptions = {},
) {
  const supported = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const [inView, setInView] = useState(!supported)

  useEffect(() => {
    const element = ref.current
    if (!element || !supported) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, once, rootMargin, threshold, supported])

  return inView
}
