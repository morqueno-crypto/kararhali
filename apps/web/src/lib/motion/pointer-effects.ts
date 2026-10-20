import { useCallback, type PointerEvent } from 'react'
import { FINE_POINTER_QUERY } from './constants'
import { matchesQuery } from './use-media-query'

/**
 * İmlece göre hafif 3D eğim. Doğrudan style yazar (React state yok → yeniden render yok).
 * Sadece ince işaretçili, geniş ekranlı ve hareket izni olan cihazlarda çalışır.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 4) {
  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (!matchesQuery(FINE_POINTER_QUERY)) return
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      element.style.transform = `perspective(900px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg)`
    },
    [maxDeg],
  )

  const onPointerLeave = useCallback((event: PointerEvent<T>) => {
    event.currentTarget.style.transform = ''
  }, [])

  return { onPointerMove, onPointerLeave }
}

/** Mıknatıs etkisi: eleman imlece birkaç piksel çekilir. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25, max = 8) {
  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (!matchesQuery(FINE_POINTER_QUERY)) return
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const clamp = (value: number) => Math.max(-max, Math.min(max, value))
      const x = clamp((event.clientX - rect.left - rect.width / 2) * strength)
      const y = clamp((event.clientY - rect.top - rect.height / 2) * strength)
      element.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
    },
    [strength, max],
  )

  const onPointerLeave = useCallback((event: PointerEvent<T>) => {
    event.currentTarget.style.transform = ''
  }, [])

  return { onPointerMove, onPointerLeave }
}
