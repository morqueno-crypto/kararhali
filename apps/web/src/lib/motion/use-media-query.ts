import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION_QUERY } from './constants'

function getMatch(query: string) {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false
}

/** CSS medya sorgusunu canlı olarak takip eder. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => {}
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => getMatch(query),
    () => false,
  )
}

export function useReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY)
}

/** Olay anında (hook dışında) medya sorgusu kontrolü. */
export function matchesQuery(query: string) {
  return getMatch(query)
}
