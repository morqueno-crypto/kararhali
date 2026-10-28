import '@testing-library/jest-dom/vitest'
import { configure } from '@testing-library/react'
import { installTestApi } from './api'

// Sayfalar lazy yüklenir; makine yoğunken (paralel turbo / CI) ilk yükleme 1 sn'lik varsayılan bekleme süresini aşabilir.
configure({ asyncUtilTimeout: 5000 })
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
