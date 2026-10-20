# Karar Halı

Karar Halı için iki dilli (Türkçe / İngilizce), koyu temalı kurumsal site ve onu yönetecek backend. Logo, koleksiyonlar, model görselleri ve iletişim bilgileri [kararhali.com](https://www.kararhali.com)'dan alınmıştır; görseller oradan uzak URL ile yüklenir, bu yüzden geliştirme sırasında internet bağlantısı gerekir.

**Durum:** Backend/API hazır ve site tüm içeriğini API'den okuyor. Sıradaki adım: admin paneli.

> Site çalışmak için API'ye ihtiyaç duyar. `pnpm dev` ikisini birlikte başlatır; yalnızca siteyi başlatırsanız "Site şu anda yüklenemiyor" sayfası görünür.

## Gereksinimler

- Node.js 24 LTS
- pnpm (`npm i -g pnpm` veya `corepack enable`)

## Kurulum ve çalıştırma

```bash
pnpm install
cp apps/api/.env.example apps/api/.env      # OWNER_EMAIL ve OWNER_PASSWORD'ü doldurun
pnpm --filter @karar-hali/api db:seed       # veritabanı + başlangıç verisi + ana kullanıcı
pnpm dev                                    # site :5173, API :3000
```

Site http://localhost:5173 adresinde açılır ve tarayıcı diline göre `/tr` veya `/en` adresine yönlendirir. API: http://localhost:3000/api/v1.

## Komutlar

| Komut            | Açıklama                          |
| ---------------- | --------------------------------- |
| `pnpm dev`       | Site ve API geliştirme sunucuları |
| `pnpm build`     | Üretim derlemeleri                |
| `pnpm preview`   | Derlenmiş siteyi önizleme         |
| `pnpm lint`      | oxlint                            |
| `pnpm typecheck` | TypeScript kontrolü               |
| `pnpm test`      | Vitest testleri (site + API)      |
| `pnpm format`    | Prettier ile biçimlendirme        |

## Yapı

```
apps/web         → Site (Vite + React + TS + Tailwind v4 + React Router + GSAP)
apps/api         → Backend (Hono + Drizzle + SQLite) — bkz. apps/api/README.md
packages/shared  → Ortak zod şemaları ve tipler
```

Sayfalar: Ana sayfa, Kurumsal, Koleksiyonlar (halı / rulo kesim filtresi), Koleksiyon detayı (model ızgarası), Model detayı (fotoğraf, renk seçenekleri, ebatlar), Üretim, İletişim, 404. Her sayfa Türkçe ve İngilizce mevcuttur (ör. `/tr/koleksiyonlar/laguna/6055a-kahve` ↔ `/en/collections/laguna/6055a-kahve`).

## Dağıtım

- `apps/web/dist` statiktir. SPA olduğu için sunucuda tüm yollar `index.html`'e yönlendirilmelidir.
- API bir Node.js süreci olarak çalışır: `pnpm --filter @karar-hali/api build && pnpm --filter @karar-hali/api start`.
- Site ve API aynı alan adı altında yayınlanmalıdır (ör. `/api` → API). Böylece oturum çerezleri sorunsuz çalışır.
