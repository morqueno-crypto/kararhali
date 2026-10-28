import { screen, waitFor, within } from '@testing-library/react'
import { signIn, testApi } from './test/api'
import { renderApp } from './test/render'

beforeEach(() => signIn())

describe('koleksiyon düzenleyici', () => {
  it('yeni koleksiyon oluşturur; adres addan üretilir', async () => {
    const { user, router } = renderApp('/collections/new')

    await user.type(await screen.findByLabelText('Koleksiyon adı'), 'Yeni Çağ')
    expect(screen.getByLabelText('Adres (slug)')).toHaveValue('yeni-cag')

    await user.click(screen.getByRole('button', { name: '200x290' }))
    await user.type(screen.getByLabelText('Türkçe'), 'Modern desenler.')
    await user.type(screen.getByLabelText('English'), 'Modern patterns.')
    await user.click(screen.getByRole('button', { name: 'Koleksiyonu oluştur' }))

    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/collections\/\d+$/))
    expect(await screen.findByText('Bu koleksiyonda henüz model yok')).toBeInTheDocument()

    const response = await testApi().request('/api/v1/collections/yeni-cag?locale=tr')
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toMatchObject({
      name: 'Yeni Çağ',
      sizes: ['200x290'],
      description: 'Modern desenler.',
    })
  })

  it('eksik alanlarda kaydetmez ve alan hatası gösterir', async () => {
    const { user, router } = renderApp('/collections/new')

    await user.click(await screen.findByRole('button', { name: 'Koleksiyonu oluştur' }))

    expect(await screen.findAllByText(/./, { selector: 'p.text-danger' })).not.toHaveLength(0)
    expect(router.state.location.pathname).toBe('/collections/new')
  })
})

describe('içerik düzenleyici', () => {
  it('Türkçe başlığı kaydeder ve site API’sine yansır', async () => {
    const { user } = renderApp('/content/home.story')

    const panel = await screen.findByRole('tabpanel', { name: 'Türkçe' })
    const title = within(panel).getByLabelText('Başlık')
    await user.clear(title)
    await user.type(title, 'Yeni hikâye başlığı')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    // API kuralı: vurgulu kısım başlıkta geçmeli. Sunucu hatası ilgili alanın altında görünür.
    expect(await within(panel).findByText('Başlıkta geçen bir parça olmalı')).toBeInTheDocument()

    await user.clear(within(panel).getByLabelText('Vurgulu kısım'))
    await user.type(within(panel).getByLabelText('Vurgulu kısım'), 'hikâye')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(await screen.findByText(/kaydedildi/)).toBeInTheDocument()

    const site = await (await testApi().request('/api/v1/site?locale=tr')).json()
    expect(site.content['home.story'].title).toBe('Yeni hikâye başlığı')
    // İngilizce içerik değişmeden kalır
    const siteEn = await (await testApi().request('/api/v1/site?locale=en')).json()
    expect(siteEn.content['home.story'].title).not.toBe('Yeni hikâye başlığı')
  })
})

describe('üretim yolculuğu', () => {
  it('bir bölümün başlığını (iç içe alan) kaydeder', async () => {
    const { user } = renderApp('/content/home.journey')

    const panel = await screen.findByRole('tabpanel', { name: 'Türkçe' })
    // Her bölümde bir "Başlık" alanı var; ilk ikisi giriş ve iplik bölümü
    const title = within(panel).getAllByLabelText('Başlık')[1]!
    await user.clear(title)
    await user.type(title, 'İplik tezgâha yola çıkar')
    await user.click(screen.getByRole('button', { name: 'Kaydet' }))

    expect(await screen.findByText(/kaydedildi/)).toBeInTheDocument()
    const site = await (await testApi().request('/api/v1/site?locale=tr')).json()
    expect(site.content['home.journey'].chapters.creel.title).toBe('İplik tezgâha yola çıkar')
  })
})

describe('renkler', () => {
  it('aynı kodla ikinci renk eklenince alan hatası gösterir', async () => {
    const { user } = renderApp('/colors')

    await user.click(await screen.findByRole('button', { name: /Yeni renk/ }))
    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText('Kod'), 'kahve')
    await user.type(within(dialog).getByLabelText('Türkçe ad'), 'Kahve 2')
    await user.type(within(dialog).getByLabelText('English name'), 'Brown 2')
    await user.click(within(dialog).getByRole('button', { name: 'Rengi ekle' }))

    expect(await within(dialog).findByText('Bu kodla bir renk zaten var')).toBeInTheDocument()
  })
})
