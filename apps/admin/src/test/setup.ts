import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { installTestApi } from './api'

// jsdom'da olmayan tarayıcı API'leri (Radix ve sonner kullanıyor)
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})) as unknown as typeof window.matchMedia
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Element.prototype.scrollIntoView ??= vi.fn()
Element.prototype.hasPointerCapture ??= () => false
Element.prototype.releasePointerCapture ??= vi.fn()

// Panel, test dosyası başına oluşturulan gerçek (bellek içi) API'ye bağlanır.
installTestApi()

afterEach(() => cleanup())
