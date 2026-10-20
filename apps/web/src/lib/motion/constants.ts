/** Ortak hareket sabitleri. CSS tarafındaki karşılıkları styles/globals.css içinde. */
export const EASE = {
  /** GSAP adı; CSS: --ease-out-expo */
  outExpo: 'expo.out',
  inOut: 'power2.inOut',
  out: 'power3.out',
} as const

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1,
} as const

/** Ağır imleç efektleri (tilt, mıknatıs, özel imleç) yalnızca bu koşulda çalışır. */
export const FINE_POINTER_QUERY =
  '(pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)'

/** Pin'li scroll sahneleri (yatay şerit, üretim hikâyesi) yalnızca bu koşulda çalışır. */
export const DESKTOP_MOTION_QUERY =
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
