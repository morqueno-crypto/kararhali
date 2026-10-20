import { contactMessages } from '../src/db/schema'
import { createTestApp } from './helpers'

describe('herkese açık API', () => {
  let t: Awaited<ReturnType<typeof createTestApp>>
  beforeEach(async () => {
    t = await createTestApp()
  })

  it('sağlık kontrolü', async () => {
    const response = await t.request('/api/v1/health')
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  it('site verisini dile göre döner', async () => {
    const tr = await (await t.request('/api/v1/site?locale=tr')).json()
    const en = await (await t.request('/api/v1/site?locale=en')).json()
    expect(tr.content['home.hero'].title).toBe('Kararsız kalmayın.')
    expect(en.content['home.hero'].title).toBe('Decide with confidence.')
    expect(tr.settings.contact.email).toBe('karar@kararhali.com')
    expect(en.settings.contact.address).toContain('Türkiye')
  })

  it('koleksiyonları listeler ve filtreler', async () => {
    const all = await (await t.request('/api/v1/collections?locale=tr')).json()
    expect(all.items).toHaveLength(22)
    const rolls = await (await t.request('/api/v1/collections?category=roll')).json()
    expect(rolls.items.every((c: { category: string }) => c.category === 'roll')).toBe(true)
    const featured = await (await t.request('/api/v1/collections?featured=true')).json()
    expect(featured.items.length).toBeGreaterThan(0)
    expect(featured.items.every((c: { featured: boolean }) => c.featured)).toBe(true)
  })

  it('koleksiyon ve model detayını döner', async () => {
    const laguna = await (await t.request('/api/v1/collections/laguna?locale=en')).json()
    expect(laguna.name).toBe('Laguna')
    expect(laguna.models[0]).toMatchObject({ slug: '6055a-kahve', code: '6055A', color: 'Brown' })

    const detail = await (await t.request('/api/v1/collections/laguna/models/6055a-kahve')).json()
    expect(detail.model.color).toBe('Kahve')
    expect(detail.variants.map((m: { slug: string }) => m.slug)).toEqual([
      '6055a-kahve',
      '6055a-gri',
    ])
    expect(detail.related.every((m: { code: string }) => m.code !== '6055A')).toBe(true)
  })

  it('bulunamayan kayıtlar için 404 ve geçersiz parametre için 400 döner', async () => {
    expect((await t.request('/api/v1/collections/yok')).status).toBe(404)
    expect((await t.request('/api/v1/collections/laguna/models/yok')).status).toBe(404)
    expect((await t.request('/api/v1/collections?locale=de')).status).toBe(400)
    expect((await t.request('/api/v1/olmayan-adres')).status).toBe(404)
  })

  it('iletişim mesajını kaydeder, geçersiz veriyi reddeder', async () => {
    const valid = {
      name: 'Ayşe Yılmaz',
      email: 'ayse@example.com',
      subject: 'dealership',
      message: 'Bayilik hakkında bilgi almak istiyorum.',
      locale: 'tr',
    }
    expect((await t.request('/api/v1/contact', { method: 'POST', json: valid })).status).toBe(201)

    const invalid = await t.request('/api/v1/contact', {
      method: 'POST',
      json: { ...valid, email: 'gecersiz', message: 'kısa' },
    })
    expect(invalid.status).toBe(400)
    const body = await invalid.json()
    expect(body.error.code).toBe('validation_error')
    expect(Object.keys(body.error.details.fieldErrors)).toEqual(['email', 'message'])

    // Bot tuzağı doluysa 201 döner ama kaydetmez
    const bot = await t.request('/api/v1/contact', {
      method: 'POST',
      json: { ...valid, website: 'http://spam.example' },
    })
    expect(bot.status).toBe(201)
    const rows = await t.db.select().from(contactMessages)
    expect(rows).toHaveLength(1)
  })

  it('iletişim formunu hız sınırına tabi tutar', async () => {
    const valid = {
      name: 'Test',
      email: 'test@example.com',
      subject: 'other',
      message: 'Hız sınırı testi mesajı.',
    }
    const statuses = []
    for (let i = 0; i < 4; i += 1) {
      statuses.push((await t.request('/api/v1/contact', { method: 'POST', json: valid })).status)
    }
    expect(statuses).toEqual([201, 201, 201, 429])
  })
})
