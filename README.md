# Karar Halı

Karar Halı için iki dilli (Türkçe / İngilizce), koyu temalı kurumsal site, backend ve yönetim paneli. Logo, koleksiyonlar, model görselleri ve iletişim bilgileri [kararhali.com](https://www.kararhali.com)'dan alınmıştır; görseller oradan uzak URL ile yüklenir, bu yüzden geliştirme sırasında internet bağlantısı gerekir.

**Durum:** Backend/API, site ve yönetim paneli hazır. Sitedeki tüm içerik (koleksiyonlar, modeller, renkler, sayfa metinleri, görseller, iletişim bilgileri) panelden yönetilir.

> Site ve panel çalışmak için API'ye ihtiyaç duyar. `pnpm dev` üçünü birlikte başlatır; yalnızca siteyi başlatırsanız "Site şu anda yüklenemiyor" sayfası görünür.

## Gereksinimler

- Node.js 24 LTS
- pnpm (`npm i -g pnpm` veya `corepack enable`)

## Kurulum ve çalıştırma

```bash
pnpm install
cp apps/api/.env.example apps/api/.env      # OWNER_EMAIL ve OWNER_PASSWORD'ü doldurun
pnpm --filter @karar-hali/api db:seed       # veritabanı + başlangıç verisi + ana kullanıcı
pnpm dev                                    # site :5173, panel :5174, API :3000
```

Site http://localhost:5173 adresinde açılır ve tarayıcı diline göre `/tr` veya `/en` adresine yönlendirir. API: http://localhost:3000/api/v1.

## Yönetim paneli

http://localhost:5174 — `apps/api/.env` içindeki `OWNER_EMAIL` / `OWNER_PASSWORD` ile giriş yapılır. Sitede kayıt olma yoktur; yeni hesapları yalnızca ana kullanıcı (owner) **Kullanıcılar** sayfasından açar.

| Bölüm            | Ne yapılır                                                                                                                         | Kimler          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Panel            | Özet sayılar, son mesajlar, son düzenlenen içerikler                                                                               | Herkes          |
| Koleksiyonlar    | Koleksiyon ekle/düzenle/sil, sürükle-bırak sıralama, yayın ve öne çıkarma; koleksiyon içinde modeller (desen kodu, renk, fotoğraf) | Herkes          |
| Renkler          | Model renk paleti                                                                                                                  | Herkes          |
| Sayfa içerikleri | Tüm sayfa başlık, metin ve görselleri; Türkçe/İngilizce sekmeli                                                                    | Herkes          |
| Medya            | Görsel yükleme, açıklama (alt metin), silme                                                                                        | Herkes          |
| Mesajlar         | İletişim formu mesajları; okundu/arşiv, e-posta ile yanıt                                                                          | Owner, yönetici |
| Site ayarları    | Site adı, logo, iletişim bilgileri, sosyal medya                                                                                   | Owner, yönetici |
| Kullanıcılar     | Hesap açma, rol, pasifleştirme, şifre sıfırlama                                                                                    | Yalnızca owner  |

Roller: **owner** (ana kullanıcı), **admin** (yönetici), **editor** (editör). Asıl yetki kontrolü API'dedir; panel yalnızca yetkisiz bölümleri gizler.

## Komutlar

| Komut            | Açıklama                                 |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Site, panel ve API geliştirme sunucuları |
| `pnpm build`     | Üretim derlemeleri                       |
| `pnpm preview`   | Derlenmiş siteyi önizleme                |
| `pnpm lint`      | oxlint                                   |
| `pnpm typecheck` | TypeScript kontrolü                      |
| `pnpm test`      | Vitest testleri (site, panel, API)       |
| `pnpm format`    | Prettier ile biçimlendirme               |

## Yapı

```
apps/web         → Site (Vite + React + TS + Tailwind v4 + React Router + GSAP)
apps/admin       → Yönetim paneli (Vite + React + TanStack Query + react-hook-form + Radix)
apps/api         → Backend (Hono + Drizzle + SQLite) — bkz. apps/api/README.md
packages/shared  → Ortak zod şemaları ve tipler
```

Sayfalar: Ana sayfa, Kurumsal, Koleksiyonlar (halı / rulo kesim filtresi), Koleksiyon detayı (model ızgarası), Model detayı (fotoğraf, renk seçenekleri, ebatlar), Üretim, İletişim, 404. Her sayfa Türkçe ve İngilizce mevcuttur (ör. `/tr/koleksiyonlar/laguna/6055a-kahve` ↔ `/en/collections/laguna/6055a-kahve`).

## Dağıtım

- `apps/web/dist` ve `apps/admin/dist` statiktir. İkisi de SPA olduğu için sunucuda tüm yollar kendi `index.html`'lerine yönlendirilmelidir.
- API bir Node.js süreci olarak çalışır: `pnpm --filter @karar-hali/api build && pnpm --filter @karar-hali/api start`.
- Panel ve API aynı alan adı altında yayınlanmalıdır (ör. `yonetim.kararhali.com` + `/api` → API). Böylece oturum çerezi ve CSRF (Origin) kontrolü sorunsuz çalışır; panelin adresi API'nin `CORS_ORIGINS` listesinde olmalıdır.
