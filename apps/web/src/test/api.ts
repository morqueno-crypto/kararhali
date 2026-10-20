import { resolve } from 'node:path'
import { createTestApp } from '@karar-hali/api/testing'

type TestApi = Awaited<ReturnType<typeof createTestApp>>

let api: TestApi | undefined
let failNext: { status: number; body: unknown } | undefined

/**
 * Testlerde sahte veri yerine GERÇEK API kullanılır: her test dosyası için bellek içi SQLite +
 * migration + seed ile bir API örneği oluşturulur ve sitenin fetch çağrıları ona yönlendirilir.
 * Böylece testler site ile API arasındaki sözleşmeyi de doğrular.
 */
export function installTestApi() {
  beforeAll(async () => {
    // Testler apps/web dizininden çalışır; jsdom ortamında import.meta.url file: olmadığı için yol verilir.
    api = await createTestApp({ migrationsFolder: resolve(process.cwd(), '../api/drizzle') })
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      const path = url.replace(/^https?:\/\/[^/]+/, '')
      if (failNext) {
        const { status, body } = failNext
        failNext = undefined
        return new Response(JSON.stringify(body), {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return api!.app.request(path, init)
    }) as typeof fetch
  })
}

/** Test içinden API'ye (ör. veritabanına) erişim. */
export function testApi() {
  if (!api) throw new Error('Test API henüz hazır değil')
  return api
}

/** Bir sonraki isteği verilen hatayla yanıtla (ör. 429 hız sınırı senaryosu). */
export function failNextRequest(status: number, body: unknown) {
  failNext = { status, body }
}
