import { createTestApp, OWNER } from './helpers'

describe('kimlik doğrulama', () => {
  let t: Awaited<ReturnType<typeof createTestApp>>
  beforeEach(async () => {
    t = await createTestApp()
  })

  it('yanlış şifreyle giriş 401 döner, mesaj e-postanın varlığını ele vermez', async () => {
    const wrongPassword = await t.request('/api/v1/auth/login', {
      method: 'POST',
      json: { email: OWNER.email, password: 'yanlis-sifre' },
    })
    const unknownUser = await t.request('/api/v1/auth/login', {
      method: 'POST',
      json: { email: 'yok@test.local', password: 'yanlis-sifre' },
    })
    expect(wrongPassword.status).toBe(401)
    expect(unknownUser.status).toBe(401)
    expect((await wrongPassword.json()).error.message).toBe(
      (await unknownUser.json()).error.message,
    )
  })

  it('giriş httpOnly çerez verir; /me oturumu döner, çıkış oturumu kapatır', async () => {
    const response = await t.request('/api/v1/auth/login', {
      method: 'POST',
      json: { email: 'OWNER@test.local', password: OWNER.password },
    })
    expect(response.status).toBe(200)
    const setCookie = response.headers.get('set-cookie') ?? ''
    expect(setCookie).toMatch(/karar_session=/)
    expect(setCookie).toMatch(/HttpOnly/i)
    expect(setCookie).toMatch(/SameSite=Lax/i)
    const cookie = setCookie.split(';')[0]!

    const me = await (await t.request('/api/v1/auth/me', { cookie })).json()
    expect(me.user).toMatchObject({ email: OWNER.email, role: 'owner' })
    expect(me.user.passwordHash).toBeUndefined()

    expect((await t.request('/api/v1/auth/logout', { method: 'POST', cookie })).status).toBe(204)
    expect((await t.request('/api/v1/auth/me', { cookie })).status).toBe(401)
  })

  it('oturum olmadan yönetim uçları 401 döner', async () => {
    expect((await t.request('/api/v1/auth/me')).status).toBe(401)
    expect((await t.request('/api/v1/admin/dashboard')).status).toBe(401)
    expect(
      (await t.request('/api/v1/admin/dashboard', { cookie: 'karar_session=sahte' })).status,
    ).toBe(401)
  })

  it('şifre değiştirince diğer oturumlar kapanır, mevcut oturum açık kalır', async () => {
    const first = await t.login(OWNER.email, OWNER.password)
    const second = await t.login(OWNER.email, OWNER.password)

    const wrong = await t.request('/api/v1/auth/change-password', {
      method: 'POST',
      cookie: first,
      json: { currentPassword: 'yanlis', newPassword: 'yeni-sifre-12345' },
    })
    expect(wrong.status).toBe(400)

    const ok = await t.request('/api/v1/auth/change-password', {
      method: 'POST',
      cookie: first,
      json: { currentPassword: OWNER.password, newPassword: 'yeni-sifre-12345' },
    })
    expect(ok.status).toBe(200)
    expect((await t.request('/api/v1/auth/me', { cookie: first })).status).toBe(200)
    expect((await t.request('/api/v1/auth/me', { cookie: second })).status).toBe(401)
    await expect(t.login(OWNER.email, 'yeni-sifre-12345')).resolves.toMatch(/karar_session=/)
  })

  it('başarısız giriş denemeleri hız sınırına takılır', async () => {
    const statuses = []
    for (let i = 0; i < 6; i += 1) {
      const response = await t.request('/api/v1/auth/login', {
        method: 'POST',
        json: { email: OWNER.email, password: 'yanlis-sifre' },
      })
      statuses.push(response.status)
    }
    expect(statuses.slice(0, 5).every((status) => status === 401)).toBe(true)
    expect(statuses[5]).toBe(429)
  })
})
