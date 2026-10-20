import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleContext, type Locale } from '@/i18n'
import { failNextRequest, testApi } from '@/test/api'
import { ContactForm } from './contact-form'

function renderForm(locale: Locale) {
  render(
    <LocaleContext value={locale}>
      <ContactForm />
    </LocaleContext>,
  )
}

async function fillValidForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Ad Soyad'), 'Ayşe Yılmaz')
  await user.type(screen.getByLabelText('E-posta'), 'ayse@example.com')
  await user.type(screen.getByLabelText('Mesajınız'), 'Bayilik hakkında bilgi almak istiyorum.')
  await user.click(screen.getByRole('button', { name: 'Mesajı Gönder' }))
}

describe('ContactForm', () => {
  it("eksik alanlarda hata gösterir ve API'ye istek atmaz", async () => {
    const user = userEvent.setup()
    renderForm('tr')
    await user.click(screen.getByRole('button', { name: 'Mesajı Gönder' }))
    expect(await screen.findByText('Lütfen adınızı girin.')).toBeInTheDocument()
    expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument()
  })

  it('hata mesajlarını İngilizce gösterir', async () => {
    const user = userEvent.setup()
    renderForm('en')
    await user.click(screen.getByRole('button', { name: 'Send Message' }))
    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument()
  })

  it("geçerli formu API'ye gönderir; mesaj panelde görünecek şekilde kaydedilir", async () => {
    renderForm('tr')
    await fillValidForm()
    expect(await screen.findByText('Mesajınız alındı', {}, { timeout: 3000 })).toBeInTheDocument()

    const rows = await testApi().listContactMessages()
    expect(rows.at(-1)).toMatchObject({ name: 'Ayşe Yılmaz', subject: 'dealership', locale: 'tr' })
  })

  it('hız sınırına takılınca girilenleri koruyarak uyarı gösterir', async () => {
    renderForm('tr')
    failNextRequest(429, { error: { code: 'too_many_requests', message: 'x' } })
    await fillValidForm()
    expect(await screen.findByRole('alert')).toHaveTextContent('çok fazla mesaj')
    expect(screen.getByLabelText('Ad Soyad')).toHaveValue('Ayşe Yılmaz')
  })
})
