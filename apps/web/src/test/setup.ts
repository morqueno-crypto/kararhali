import '@testing-library/jest-dom/vitest'
import { installMatchMedia, resetMediaMatcher } from './media'

// jsdom scrollTo desteklemez (ScrollRestoration kullanıyor).
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

// jsdom matchMedia desteklemez; varsayılan olarak reduced-motion açık davranır.
installMatchMedia()

afterEach(() => {
  resetMediaMatcher()
  try {
    sessionStorage.clear()
  } catch {
    // erişilemiyorsa yok say
  }
})
