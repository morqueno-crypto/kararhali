import { useCallback, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useInView } from '@/lib/motion/use-in-view'

export type RevealVariant = 'up' | 'fade' | 'scale' | 'mask' | 'tracking'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  variant?: RevealVariant
  /** Gecikme (ms); listelerde sırayla gelmek için index * 80 gibi kullanılır. */
  delay?: number
  className?: string
}

/**
 * Görünüm alanına girince oynayan giriş animasyonu (IntersectionObserver + CSS, GSAP gerekmez).
 * Stiller globals.css içindeki [data-reveal] kurallarında; reduced-motion açıksa içerik hep görünür.
 * `mask` varyantında sarmalayan eleman overflow: hidden olmalıdır.
 */
export function Reveal({
  children,
  as: Component = 'div',
  variant = 'up',
  delay = 0,
  className,
}: RevealProps) {
  const target = useRef<Element | null>(null)
  // `mask` varyantında eleman, overflow: hidden ebeveynin dışına kaydırılmış başlar; kırpıldığı için
  // kendisi hiç "görünür" sayılmaz. Bu yüzden kaydırılmayan ebeveyn izlenir.
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      target.current = variant === 'mask' ? (node?.parentElement ?? node) : node
    },
    [variant],
  )
  const inView = useInView(target)

  return (
    <Component
      ref={setRef}
      data-reveal={variant}
      data-revealed={inView ? '' : undefined}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Component>
  )
}
