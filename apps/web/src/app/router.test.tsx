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
  it('ana sayfayı render eder', async () => {
    renderRoute('/')
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('İlmek ilmek')
  })

  it('koleksiyon detayını render eder', async () => {
    renderRoute('/koleksiyonlar/anadolu-miras')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Anadolu Miras' }),
    ).toBeInTheDocument()
  })

  it('bilinmeyen koleksiyon için 404 gösterir', async () => {
    renderRoute('/koleksiyonlar/olmayan')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('bilinmeyen route için 404 gösterir', async () => {
    renderRoute('/olmayan-sayfa')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('koleksiyonları kategoriye göre filtreler', async () => {
    renderRoute('/koleksiyonlar')
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
