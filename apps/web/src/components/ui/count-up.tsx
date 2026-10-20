import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/lib/motion/use-in-view'
import { useReducedMotion } from '@/lib/motion/use-media-query'

/** "~300", "60 yıl", "1966" → önek, sayı, sonek. Sayı yoksa null. */
function parse(value: string) {
  const match = value.match(/^(\D*)(\d+)(.*)$/)
  if (!match) return null
  const [, prefix = '', digits = '0', suffix = ''] = match
  return { prefix, target: Number(digits), suffix }
}

/**
 * Görünüme girince sayıyı hedef değere kadar sayar (requestAnimationFrame, GSAP gerekmez).
 * Ekran okuyucular baştan nihai değeri okur.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { threshold: 0.4 })
  const reduced = useReducedMotion()
  const parsed = parse(value)
  const target = parsed?.target ?? 0
  // Yıllar sıfırdan değil, yakın bir değerden başlar (1906 → 1966 gibi).
  const start = target >= 1000 ? target - 60 : 0
  const [current, setCurrent] = useState(start)

  useEffect(() => {
    if (reduced || !inView) return
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCurrent(Math.round(start + (target - start) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced, inView, start, target, duration])

  if (!parsed) return <>{value}</>

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {parsed.prefix}
        {reduced ? target : current}
        {parsed.suffix}
      </span>
    </span>
  )
}
