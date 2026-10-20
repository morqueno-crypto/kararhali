import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { LocaleContext } from '@/i18n'
import { setMediaMatcher } from '@/test/media'
import { HeroSection } from './hero-section'

function renderHero() {
  return render(
    <MemoryRouter>
      <LocaleContext value="tr">
        <HeroSection image="https://example.com/hero.jpg" />
      </LocaleContext>
    </MemoryRouter>,
  )
}

describe('HeroSection', () => {
  it('reduced-motion açıkken giriş animasyonu oynamaz, içerik görünür', () => {
    renderHero()
    expect(screen.queryByRole('button', { name: /Girişi geç/ })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kararsız kalmayın.')
    expect(screen.getByRole('link', { name: /Koleksiyonları keşfedin/ })).toBeVisible()
    expect(document.documentElement.style.overflow).not.toBe('hidden')
  })

  it('"Girişi geç" animasyonu bitirir, kaydırmayı açar ve oturuma kaydeder', async () => {
    setMediaMatcher(() => false) // hareket izni var
    renderHero()
    const skip = screen.getByRole('button', { name: /Girişi geç/ })
    expect(document.documentElement.style.overflow).toBe('hidden')

    await userEvent.setup().click(skip)

    await waitFor(() => expect(skip).not.toBeInTheDocument())
    expect(document.documentElement.style.overflow).not.toBe('hidden')
    expect(sessionStorage.getItem('karar:intro-seen')).toBe('1')
  })

  it('ikinci ziyarette kısa giriş oynar (tezgâh gösterilmez)', () => {
    setMediaMatcher(() => false)
    sessionStorage.setItem('karar:intro-seen', '1')
    const { container } = renderHero()
    expect(container.querySelector('[data-hero="loom"]')).toBeNull()
    expect(screen.getByRole('button', { name: /Girişi geç/ })).toBeInTheDocument()
  })
})
