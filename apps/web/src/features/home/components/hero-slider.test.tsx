import type { PublicContent } from '@karar-hali/shared'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { LocaleContext } from '@/i18n'
import { setMediaMatcher } from '@/test/media'
import { HeroSlider } from './hero-slider'

const hero: PublicContent['home.hero'] = {
  eyebrow: 'Gaziantep',
  title: 'Kararsız kalmayın.',
  titleAccent: 'kalmayın.',
  text: 'Metin',
  primaryCta: 'Koleksiyonları keşfedin',
  secondaryCta: 'Hikâyemiz',
  image: 'https://example.com/hero.jpg',
  imageAlt: 'Salon',
}

const slides = ['Bir', 'İki', 'Üç'].map((name, index) => ({
  image: `https://example.com/${index}.jpg`,
  imageAlt: `${name} görseli`,
  eyebrow: `${name} üst başlık`,
  title: `${name} başlık`,
  titleAccent: 'başlık',
  text: `${name} metni`,
}))

function renderSlider() {
  return render(
    <MemoryRouter>
      <LocaleContext value="tr">
        <HeroSlider hero={hero} slides={slides} />
      </LocaleContext>
    </MemoryRouter>,
  )
}

/** Görünür (aria-hidden olmayan) slayt */
function activeSlide() {
  return screen.getByRole('group', { name: /^Slayt/ })
}

describe('HeroSlider', () => {
  it('ilk slaytı gösterir; diğer slaytlar erişilebilirlik ağacından gizlidir', () => {
    renderSlider()
    expect(activeSlide()).toHaveAccessibleName('Slayt 1 / 3')
    expect(within(activeSlide()).getByRole('heading', { level: 2 })).toHaveTextContent('Bir başlık')
    expect(screen.getAllByRole('group', { name: /^Slayt/ })).toHaveLength(1)
  })

  it('önceki/sonraki, slayt düğmeleri ve ok tuşlarıyla gezilir (başa sarar)', async () => {
    const user = userEvent.setup()
    renderSlider()

    await user.click(screen.getByRole('button', { name: 'Sonraki slayt' }))
    expect(activeSlide()).toHaveAccessibleName('Slayt 2 / 3')

    await user.click(screen.getByRole('button', { name: '3. slayta git' }))
    expect(activeSlide()).toHaveAccessibleName('Slayt 3 / 3')

    await user.click(screen.getByRole('button', { name: 'Sonraki slayt' }))
    expect(activeSlide()).toHaveAccessibleName('Slayt 1 / 3')

    await user.click(screen.getByRole('button', { name: 'Önceki slayt' }))
    expect(activeSlide()).toHaveAccessibleName('Slayt 3 / 3')

    fireEvent.keyDown(activeSlide(), { key: 'ArrowRight' })
    expect(activeSlide()).toHaveAccessibleName('Slayt 1 / 3')
  })

  it('reduced-motion açıkken otomatik geçiş ve durdur düğmesi yoktur', () => {
    renderSlider()
    expect(screen.queryByRole('button', { name: /Otomatik geçişi/ })).not.toBeInTheDocument()
  })

  it('hareket izni varken ilerleme çubuğu bitince sonraki slayda geçer; durdurulabilir', async () => {
    setMediaMatcher(() => false)
    const user = userEvent.setup()
    const { container } = renderSlider()

    const progress = () => container.querySelector('.animate-slide-progress') as HTMLElement
    expect(progress().style.animationPlayState).toBe('running')

    // jsdom'da AnimationEvent yok; React bu durumda önekli olayı dinler.
    fireEvent(progress(), new Event('webkitAnimationEnd', { bubbles: true }))
    expect(activeSlide()).toHaveAccessibleName('Slayt 2 / 3')

    await user.click(screen.getByRole('button', { name: 'Otomatik geçişi durdur' }))
    expect(progress().style.animationPlayState).toBe('paused')
    expect(screen.getByRole('button', { name: 'Otomatik geçişi başlat' })).toBeInTheDocument()
  })
})
