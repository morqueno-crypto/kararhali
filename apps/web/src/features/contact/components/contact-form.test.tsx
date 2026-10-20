import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './contact-form'

describe('ContactForm', () => {
  it('eksik alanlarda hata gösterir', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.click(screen.getByRole('button', { name: 'Mesajı Gönder' }))
    expect(await screen.findByText('Lütfen adınızı girin.')).toBeInTheDocument()
    expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument()
  })

  it('geçerli formda başarı mesajı gösterir', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)
    await user.type(screen.getByLabelText('Ad Soyad'), 'Ayşe Yılmaz')
    await user.type(screen.getByLabelText('E-posta'), 'ayse@example.com')
    await user.type(screen.getByLabelText('Mesajınız'), 'Bayilik hakkında bilgi almak istiyorum.')
    await user.click(screen.getByRole('button', { name: 'Mesajı Gönder' }))
    expect(await screen.findByText('Mesajınız alındı', {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
