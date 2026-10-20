import { useEffect, useRef, useState } from 'react'
import { FINE_POINTER_QUERY } from '@/lib/motion/constants'
import { useMediaQuery } from '@/lib/motion/use-media-query'

/**
 * `data-cursor="Etiket"` taşıyan elemanların üzerinde imleci takip eden yuvarlak etiket.
 * Yalnızca ince işaretçi + geniş ekran + hareket izni varken çalışır; native imleç gizlenmez.
 */
export function CustomCursor() {
  const enabled = useMediaQuery(FINE_POINTER_QUERY)
  return enabled ? <CursorFollower /> : null
}

function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const target = { x: -100, y: -100 }
    const current = { x: -100, y: -100 }
    let frame = 0

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      const host = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      const next = host?.dataset.cursor ?? null
      setLabel((previous) => (previous === next ? previous : next))
    }

    const tick = () => {
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[80] will-change-transform"
    >
      <div
        className={`flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-xs font-semibold tracking-wider text-on-accent uppercase shadow-2xl shadow-canvas transition-[scale,opacity] duration-500 ease-(--ease-out-expo) ${label ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        {label}
      </div>
    </div>
  )
}
