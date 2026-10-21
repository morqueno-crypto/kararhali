import { resolve } from 'node:path'
import { createTestApp, OWNER } from '@karar-hali/api/testing'

type TestApi = Awaited<ReturnType<typeof createTestApp>>

let api: TestApi | undefined
/** Tarayıcının çerez kavanozu yerine: API'nin verdiği oturum çerezi burada tutulur. */
let cookie: string | undefined

export { OWNER }

/**
 * Panel testleri sahte veri yerine GERÇEK API ile çalışır: test dosyası başına bellek içi
 * SQLite + migration + seed ile bir API örneği kurulur, panelin fetch çağrıları ona yönlendirilir.
 * Oturum çerezi ve Origin başlığı (CSRF kontrolü) tarayıcıdaki gibi davranır.
 */
export function installTestApi() {
  beforeAll(async () => {
    api = await createTestApp({ migrationsFolder: resolve(process.cwd(), '../api/drizzle') })
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const path = url.replace(/^https?:\/\/[^/]+/, '')
      const headers = new Headers(init?.headers)
      if (cookie) headers.set('cookie', cookie)
      if (init?.method && init.method !== 'GET') headers.set('origin', 'http://localhost:5173')

      const response = await api!.app.request(path, { ...init, headers })
      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        const pair = setCookie.split(';')[0]!
        // Çıkışta çerez boş değer + geçmiş tarihle silinir
        cookie = /=\s*$/.test(pair) || /max-age=0/i.test(setCookie) ? undefined : pair
      }
      return response
    }) as typeof fetch
  })

  afterEach(() => {
    cookie = undefined
  })
}

export function testApi() {
  if (!api) throw new Error('Test API henüz hazır değil')
  return api
}

/** Paneli açmadan önce oturum aç (çerez kavanoza yazılır). */
export async function signIn(email = OWNER.email, password = OWNER.password) {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error(`Giriş başarısız: ${response.status}`)
}

/** Owner olarak yeni kullanıcı oluşturur (oturumu değiştirmeden). */
export async function createUser(user: {
  email: string
  name: string
  password: string
  role: 'admin' | 'editor'
}) {
  const { request, login } = testApi()
  const ownerCookie = await login(OWNER.email, OWNER.password)
  const response = await request('/api/v1/admin/users', {
    method: 'POST',
    cookie: ownerCookie,
    json: user,
  })
  if (response.status !== 201) throw new Error(`Kullanıcı oluşturulamadı: ${response.status}`)
}
