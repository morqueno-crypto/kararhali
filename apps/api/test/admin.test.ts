import { contentSeed } from '../src/db/seed-data/content'
import { createTestApp, OWNER } from './helpers'

// 1×1 şeffaf PNG
const PNG_1X1 = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  ),
  (char) => char.charCodeAt(0),
)

describe('yönetim API', () => {
  let t: Awaited<ReturnType<typeof createTestApp>>
  let owner: string

  beforeEach(async () => {
    t = await createTestApp()
    owner = await t.login(OWNER.email, OWNER.password)
  })

  async function createUser(role: 'admin' | 'editor', email = `${role}@test.local`) {
    const response = await t.request('/api/v1/admin/users', {
      method: 'POST',
      cookie: owner,
      json: { email, name: `Test ${role}`, password: 'kullanici-sifre-1', role },
    })
    expect(response.status).toBe(201)
    return { user: (await response.json()).user, cookie: await t.login(email, 'kullanici-sifre-1') }
  }

  describe('kullanıcılar (yalnızca owner)', () => {
    it('owner kullanıcı açar; admin ve editor kullanıcı açamaz', async () => {
      const { cookie: adminCookie } = await createUser('admin')
      const { cookie: editorCookie } = await createUser('editor')
      for (const cookie of [adminCookie, editorCookie]) {
        const response = await t.request('/api/v1/admin/users', {
          method: 'POST',
          cookie,
          json: { email: 'x@test.local', name: 'X', password: 'kullanici-sifre-1', role: 'editor' },
        })
        expect(response.status).toBe(403)
        expect((await t.request('/api/v1/admin/users', { cookie })).status).toBe(403)
      }
    })

    it('ikinci bir owner açılamaz; owner kaydı değiştirilemez ve silinemez', async () => {
      const asOwner = await t.request('/api/v1/admin/users', {
        method: 'POST',
        cookie: owner,
        json: { email: 'o2@test.local', name: 'O2', password: 'kullanici-sifre-1', role: 'owner' },
      })
      expect(asOwner.status).toBe(400)

      const me = (await (await t.request('/api/v1/auth/me', { cookie: owner })).json()).user
      expect(
        (
          await t.request(`/api/v1/admin/users/${me.id}`, {
            method: 'PATCH',
            cookie: owner,
            json: { active: false },
          })
        ).status,
      ).toBe(403)
      expect(
        (await t.request(`/api/v1/admin/users/${me.id}`, { method: 'DELETE', cookie: owner }))
          .status,
      ).toBe(403)
    })

    it('pasifleştirilen kullanıcının oturumu kapanır ve tekrar giremez', async () => {
      const { user, cookie } = await createUser('editor')
      const response = await t.request(`/api/v1/admin/users/${user.id}`, {
        method: 'PATCH',
        cookie: owner,
        json: { active: false },
      })
      expect(response.status).toBe(200)
      expect((await t.request('/api/v1/auth/me', { cookie })).status).toBe(401)
      await expect(t.login('editor@test.local', 'kullanici-sifre-1')).rejects.toThrow()
    })

    it('aynı e-posta ile ikinci kullanıcı açılamaz', async () => {
      await createUser('editor')
      const duplicate = await t.request('/api/v1/admin/users', {
        method: 'POST',
        cookie: owner,
        json: {
          email: 'EDITOR@test.local',
          name: 'Tekrar',
          password: 'kullanici-sifre-1',
          role: 'editor',
        },
      })
      expect(duplicate.status).toBe(409)
    })
  })

  describe('yetkiler', () => {
    it('editor ayarlara ve mesajlara erişemez, içerik ve kataloğa erişir', async () => {
      const { cookie } = await createUser('editor')
      expect((await t.request('/api/v1/admin/settings', { cookie })).status).toBe(403)
      expect((await t.request('/api/v1/admin/messages', { cookie })).status).toBe(403)
      expect((await t.request('/api/v1/admin/content', { cookie })).status).toBe(200)
      expect((await t.request('/api/v1/admin/collections', { cookie })).status).toBe(200)
      expect((await t.request('/api/v1/admin/media', { cookie })).status).toBe(200)
    })
  })

  describe('içerik ve ayarlar', () => {
    it('içerik bloğunu günceller; site yanıtına yansır', async () => {
      const data = structuredClone(contentSeed['home.hero'])
      data.tr.title = 'Yeni başlık burada.'
      data.tr.titleAccent = 'burada.'
      const response = await t.request('/api/v1/admin/content/home.hero', {
        method: 'PUT',
        cookie: owner,
        json: data,
      })
      expect(response.status).toBe(200)

      const site = await (await t.request('/api/v1/site?locale=tr')).json()
      expect(site.content['home.hero'].title).toBe('Yeni başlık burada.')
    })

    it('geçersiz içeriği ve başlıkta geçmeyen vurguyu reddeder', async () => {
      const invalid = await t.request('/api/v1/admin/content/home.hero', {
        method: 'PUT',
        cookie: owner,
        json: { tr: { title: '' } },
      })
      expect(invalid.status).toBe(400)

      const data = structuredClone(contentSeed['home.hero'])
      data.en.titleAccent = 'başlıkta yok'
      const accent = await t.request('/api/v1/admin/content/home.hero', {
        method: 'PUT',
        cookie: owner,
        json: data,
      })
      expect(accent.status).toBe(400)
      expect((await accent.json()).error.message).toMatch(/^EN:/)

      expect(
        (await t.request('/api/v1/admin/content/olmayan.anahtar', { cookie: owner })).status,
      ).toBe(400)
    })

    it('iletişim ayarlarını günceller', async () => {
      const settings = (await (await t.request('/api/v1/admin/settings', { cookie: owner })).json())
        .items
      const contact = settings.find((item: { key: string }) => item.key === 'contact').value
      const response = await t.request('/api/v1/admin/settings/contact', {
        method: 'PUT',
        cookie: owner,
        json: { ...contact, email: 'yeni@kararhali.com' },
      })
      expect(response.status).toBe(200)
      const site = await (await t.request('/api/v1/site')).json()
      expect(site.settings.contact.email).toBe('yeni@kararhali.com')
    })
  })

  describe('katalog', () => {
    it('koleksiyon ve model oluşturur; yayından kaldırılan koleksiyon sitede görünmez', async () => {
      const created = await t.request('/api/v1/admin/collections', {
        method: 'POST',
        cookie: owner,
        json: {
          slug: 'yeni-seri',
          name: 'Yeni Seri',
          category: 'carpet',
          sizes: ['200x290'],
          description: { tr: 'Açıklama', en: 'Description' },
        },
      })
      expect(created.status).toBe(201)
      const { collection } = await created.json()

      const model = await t.request('/api/v1/admin/models', {
        method: 'POST',
        cookie: owner,
        json: {
          collectionId: collection.id,
          code: '9001A',
          colorKey: 'KAHVE',
          image: 'https://example.com/9001a.jpg',
        },
      })
      expect(model.status).toBe(201)
      expect((await model.json()).model.slug).toBe('9001a-kahve')

      const publicDetail = await (
        await t.request('/api/v1/collections/yeni-seri/models/9001a-kahve')
      ).json()
      expect(publicDetail.model.color).toBe('Kahve')

      await t.request(`/api/v1/admin/collections/${collection.id}`, {
        method: 'PATCH',
        cookie: owner,
        json: { published: false },
      })
      expect((await t.request('/api/v1/collections/yeni-seri')).status).toBe(404)
    })

    it('olmayan renkle model oluşturulamaz; kullanılan renk silinemez', async () => {
      const list = (await (await t.request('/api/v1/admin/collections', { cookie: owner })).json())
        .items
      const response = await t.request('/api/v1/admin/models', {
        method: 'POST',
        cookie: owner,
        json: {
          collectionId: list[0].id,
          code: '1234A',
          colorKey: 'MOR',
          image: 'https://example.com/a.jpg',
        },
      })
      expect(response.status).toBe(400)
      expect(
        (await t.request('/api/v1/admin/colors/KAHVE', { method: 'DELETE', cookie: owner })).status,
      ).toBe(409)
    })

    it('aynı slug ile ikinci koleksiyon 409 döner', async () => {
      const response = await t.request('/api/v1/admin/collections', {
        method: 'POST',
        cookie: owner,
        json: {
          slug: 'laguna',
          name: 'Kopya',
          category: 'carpet',
          sizes: ['200x290'],
          description: { tr: 'a', en: 'b' },
        },
      })
      expect(response.status).toBe(409)
    })

    it('koleksiyonları yeniden sıralar', async () => {
      const items = (await (await t.request('/api/v1/admin/collections', { cookie: owner })).json())
        .items
      const ids = items.map((item: { id: number }) => item.id).reverse()
      await t.request('/api/v1/admin/collections/reorder', {
        method: 'POST',
        cookie: owner,
        json: { ids },
      })
      const site = await (await t.request('/api/v1/collections')).json()
      expect(site.items[0].slug).toBe(items.at(-1).slug)
    })
  })

  describe('medya', () => {
    it('PNG yükler ve /uploads altından servis eder', async () => {
      const form = new FormData()
      form.append('file', new File([PNG_1X1], 'pixel.png', { type: 'image/png' }))
      form.append('alt', 'Bir piksel')
      const response = await t.request('/api/v1/admin/media', {
        method: 'POST',
        cookie: owner,
        body: form,
      })
      expect(response.status).toBe(201)
      const { media } = await response.json()
      expect(media).toMatchObject({ mime: 'image/png', alt: 'Bir piksel', filename: 'pixel.png' })
      expect(media.url).toMatch(/^\/uploads\/[0-9a-f-]+\.png$/)

      const file = await t.request(media.url)
      expect(file.status).toBe(200)
      expect(new Uint8Array(await file.arrayBuffer())).toEqual(PNG_1X1)

      expect(
        (await t.request(`/api/v1/admin/media/${media.id}`, { method: 'DELETE', cookie: owner }))
          .status,
      ).toBe(204)
      expect((await t.request(media.url)).status).toBe(404)
    })

    it('uzantısı görsel olan ama içeriği görsel olmayan dosyayı reddeder', async () => {
      const form = new FormData()
      form.append(
        'file',
        new File(['<script>alert(1)</script>'], 'evil.png', { type: 'image/png' }),
      )
      const response = await t.request('/api/v1/admin/media', {
        method: 'POST',
        cookie: owner,
        body: form,
      })
      expect(response.status).toBe(400)
    })

    it('başka bir kaynaktan gelen form gönderimini (CSRF) reddeder', async () => {
      const form = new FormData()
      form.append('file', new File([PNG_1X1], 'pixel.png', { type: 'image/png' }))
      const response = await t.request('/api/v1/admin/media', {
        method: 'POST',
        cookie: owner,
        body: form,
        headers: { origin: 'https://kotu-site.example' },
      })
      expect(response.status).toBe(403)
    })
  })

  describe('mesajlar ve panel özeti', () => {
    it('admin mesajları listeler ve okundu olarak işaretler; özet yeni mesaj sayısını gösterir', async () => {
      await t.request('/api/v1/contact', {
        method: 'POST',
        json: {
          name: 'Ali',
          email: 'ali@example.com',
          subject: 'export',
          message: 'İhracat için bilgi istiyorum.',
        },
      })
      const { cookie } = await createUser('admin')

      const dashboard = await (await t.request('/api/v1/admin/dashboard', { cookie })).json()
      expect(dashboard).toMatchObject({
        collectionCount: 22,
        newMessages: 1,
        userCount: 2,
        collectionsByCategory: { carpet: 9, roll: 13 },
      })
      expect(dashboard.messagesByDay).toHaveLength(14)
      expect(dashboard.messagesByDay.at(-1).count).toBe(1)
      expect(dashboard.recentMessages[0].name).toBe('Ali')

      // Editor mesaj içeriklerini panel özetinde de göremez
      const { cookie: editorCookie } = await createUser('editor')
      const editorView = await (
        await t.request('/api/v1/admin/dashboard', { cookie: editorCookie })
      ).json()
      expect(editorView.recentMessages).toEqual([])
      expect(editorView.newMessages).toBe(0)

      const list = await (await t.request('/api/v1/admin/messages?status=new', { cookie })).json()
      expect(list.total).toBe(1)
      const id = list.items[0].id
      const patched = await t.request(`/api/v1/admin/messages/${id}`, {
        method: 'PATCH',
        cookie,
        json: { status: 'read' },
      })
      expect((await patched.json()).message.status).toBe('read')
    })
  })
})
