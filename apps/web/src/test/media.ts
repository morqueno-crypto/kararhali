/**
 * jsdom'da window.matchMedia yoktur. Testler için ayarlanabilir bir sahte sürüm.
 * Varsayılan: reduced-motion AÇIK (animasyonlar kurulmaz, içerik baştan görünür → testler deterministik).
 */
type Matcher = (query: string) => boolean

const defaultMatcher: Matcher = (query) => query.includes('prefers-reduced-motion: reduce')
let matcher: Matcher = defaultMatcher

export function setMediaMatcher(next: Matcher) {
  matcher = next
}

export function resetMediaMatcher() {
  matcher = defaultMatcher
}

export function installMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: matcher(query),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
