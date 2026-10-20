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
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('İlmek ilmek')
  })

  it('İngilizce ana sayfayı render eder', async () => {
    renderRoute('/en')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Knot by knot')
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

  it('koleksiyon detayını dile göre render eder', async () => {
    renderRoute('/en/collections/anadolu-miras')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Anatolian Heritage' }),
    ).toBeInTheDocument()
  })

  it('dil değiştirince aynı sayfanın karşılığına gider', async () => {
    const router = renderRoute('/tr/koleksiyonlar/anadolu-miras')
    const user = userEvent.setup()
    await screen.findByRole('heading', { level: 1, name: 'Anadolu Miras' })
    await user.click(screen.getAllByRole('link', { name: 'English' })[0])
    await waitFor(() =>
      expect(router.state.location.pathname).toBe('/en/collections/anadolu-miras'),
    )
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Anatolian Heritage' }),
    ).toBeInTheDocument()
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
    await user.click(await screen.findByRole('button', { name: 'Kilim' }))
    // Filtre URL'yi günceller; navigasyon asenkron tamamlanır.
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { level: 3, name: 'Nordik Lin' }),
      ).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Geometrik Kilim' })).toBeInTheDocument()
  })
})
