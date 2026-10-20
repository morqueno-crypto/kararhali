import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('router', () => {
  it('Türkçe ana sayfayı render eder', async () => {
    renderRoute('/tr')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Kararsız kalmayın.')
  })

  it('İngilizce ana sayfayı render eder', async () => {
    renderRoute('/en')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
      'Decide with confidence.',
    )
  })

  it('kök adresi tarayıcı diline göre yönlendirir', async () => {
    const router = renderRoute('/')
    const expected = navigator.language.toLowerCase().startsWith('tr') ? '/tr' : '/en'
    await waitFor(() => expect(router.state.location.pathname).toBe(expected))
  })

  it('dil öneki olmayan adresi varsayılan dile yönlendirir', async () => {
    const router = renderRoute('/kurumsal')
    await waitFor(() => expect(router.state.location.pathname).toBe('/tr/kurumsal'))
  })

  it('koleksiyon detayında modelleri listeler', async () => {
    renderRoute('/tr/koleksiyonlar/laguna')
    expect(await screen.findByRole('heading', { level: 1, name: 'Laguna' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /6055A/ }).length).toBeGreaterThan(0)
  })

  it('model detayını dile göre render eder', async () => {
    renderRoute('/en/collections/laguna/6055a-kahve')
    expect(await screen.findByRole('heading', { level: 1, name: '6055A' })).toBeInTheDocument()
    expect(screen.getAllByText('Brown').length).toBeGreaterThan(0)
  })

  it('model detayında diğer renge geçer', async () => {
    const router = renderRoute('/tr/koleksiyonlar/laguna/6055a-kahve')
    const user = userEvent.setup()
    await screen.findByRole('heading', { level: 1, name: '6055A' })
    await user.click(screen.getByRole('link', { name: 'Gri' }))
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/tr/koleksiyonlar/laguna/6055a-gri'),
    )
  })

  it('dil değiştirince aynı modelin karşılığına gider', async () => {
    const router = renderRoute('/tr/koleksiyonlar/laguna/6055a-kahve')
    const user = userEvent.setup()
    await screen.findByRole('heading', { level: 1, name: '6055A' })
    await user.click(screen.getAllByRole('link', { name: 'English' })[0])
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/en/collections/laguna/6055a-kahve'),
    )
  })

  it('bilinmeyen model için 404 gösterir', async () => {
    renderRoute('/tr/koleksiyonlar/laguna/olmayan')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('bilinmeyen koleksiyon için 404 gösterir', async () => {
    renderRoute('/tr/koleksiyonlar/olmayan')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('bilinmeyen route için 404 gösterir', async () => {
    renderRoute('/en/missing-page')
    expect(await screen.findByText('Page not found', { selector: 'h1' })).toBeInTheDocument()
  })

  it('koleksiyonları kategoriye göre filtreler', async () => {
    renderRoute('/tr/koleksiyonlar')
    const user = userEvent.setup()
    await user.click(await screen.findByRole('button', { name: /Rulo Kesim/ }))
    // Filtre URL'yi günceller; navigasyon asenkron tamamlanır.
    await waitFor(() =>
      expect(screen.queryByRole('heading', { level: 3, name: 'Laguna' })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Lizbon' })).toBeInTheDocument()
  })
})
