import { screen, waitFor, within } from '@testing-library/react'
import { createUser, OWNER, signIn } from './test/api'
import { renderApp } from './test/render'

// Not: API giriş denemelerini dakikada 5 ile sınırlar; bu dosya o sınırın altında kalır.

describe('oturum', () => {
  it('oturum yokken giriş sayfasına yönlendirir ve girişten sonra istenen sayfaya döner', async () => {
    const { user, router } = renderApp('/colors')

    expect(await screen.findByRole('heading', { name: 'Giriş yapın' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/login')
    expect(router.state.location.search).toBe('?next=%2Fcolors')

    await user.type(screen.getByLabelText('E-posta'), OWNER.email)
    await user.type(screen.getByLabelText('Şifre'), OWNER.password)
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Renkler' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/colors')
    // Seed'deki renkler gerçek API'den gelir
    expect(await screen.findByText('KAHVE')).toBeInTheDocument()
  })

  it('hatalı şifrede hata mesajı gösterir', async () => {
    const { user } = renderApp('/login')

    await user.type(await screen.findByLabelText('E-posta'), OWNER.email)
    await user.type(screen.getByLabelText('Şifre'), 'yanlis-sifre-123')
    await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/hatalı/i)
  })
})

describe('roller', () => {
  it('editör yalnızca yetkili olduğu bölümleri görür', async () => {
    await createUser({
      email: 'editor@test.local',
      name: 'Ece Editör',
      password: 'editor-password-1',
      role: 'editor',
    })
    await signIn('editor@test.local', 'editor-password-1')
    renderApp('/users')

    // Kullanıcılar sayfası editöre kapalıdır
    expect(await screen.findByText('Bu sayfaya erişim yetkiniz yok')).toBeInTheDocument()

    const nav = screen.getAllByRole('navigation', { name: 'Yönetim menüsü' })[0]!
    expect(within(nav).getByRole('link', { name: /Koleksiyonlar/ })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /Sayfa içerikleri/ })).toBeInTheDocument()
    expect(within(nav).queryByRole('link', { name: /Kullanıcılar/ })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('link', { name: /Mesajlar/ })).not.toBeInTheDocument()
    expect(within(nav).queryByRole('link', { name: /Site ayarları/ })).not.toBeInTheDocument()
  })

  it('owner kullanıcı listesinde kendini salt okunur görür', async () => {
    await signIn()
    renderApp('/users')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Kullanıcılar' }),
    ).toBeInTheDocument()
    const ownerRow = (await screen.findByText(OWNER.email)).closest('tr')!
    expect(within(ownerRow).getByText('Ana kullanıcı')).toBeInTheDocument()
    expect(within(ownerRow).queryByRole('button', { name: /sil/ })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('editor@test.local')).toBeInTheDocument())
  })
})
