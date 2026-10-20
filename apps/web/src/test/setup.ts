import '@testing-library/jest-dom/vitest'

// jsdom scrollTo desteklemez (ScrollRestoration kullanıyor).
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
