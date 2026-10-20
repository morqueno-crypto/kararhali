import '@testing-library/jest-dom/vitest'
import { installTestApi } from './api'
import { installMatchMedia, resetMediaMatcher } from './media'

// jsdom scrollTo desteklemez (ScrollRestoration kullanıyor).
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo

// jsdom matchMedia desteklemez; varsayılan olarak reduced-motion açık davranır.
installMatchMedia()

// Site, test dosyası başına oluşturulan gerçek (bellek içi) API'ye bağlanır.
installTestApi()

afterEach(() => {
  resetMediaMatcher()
  try {
    sessionStorage.clear()
  } catch {
    // erişilemiyorsa yok say
  }
})
