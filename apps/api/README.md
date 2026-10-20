# Karar Halı API

Sitenin ve admin panelinin backend'i: **Hono** + **Drizzle ORM** + **SQLite** (libSQL). Doğrulama şemaları ve tipler `@karar-hali/shared` paketindedir.

## Kurulum

```bash
cp apps/api/.env.example apps/api/.env   # OWNER_EMAIL / OWNER_PASSWORD doldurun
pnpm --filter @karar-hali/api db:seed    # migration + başlangıç verisi + ana kullanıcı
pnpm --filter @karar-hali/api dev        # http://localhost:3000/api/v1
```

Kökten `pnpm dev` çalıştırıldığında site (5173) ve API (3000) birlikte açılır. Site dev sunucusu `/api` ve `/uploads` isteklerini API'ye yönlendirir.

| Komut             | Açıklama                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| `dev`             | İzleme modunda sunucu (açılışta bekleyen migration'ları uygular)                       |
| `build` / `start` | Üretim derlemesi (`dist/`) ve çalıştırma                                               |
| `test`            | Bellek içi SQLite ile entegrasyon testleri                                             |
| `db:generate`     | `src/db/schema.ts` değişince yeni migration üretir (`drizzle/`)                        |
| `db:migrate`      | Migration'ları uygular                                                                 |
| `db:seed`         | Eksik başlangıç verisini ekler; var olanın üzerine **yazmaz**, tekrar çalıştırılabilir |
| `db:studio`       | Drizzle Studio ile veritabanını tarayıcıda görüntüleme                                 |

Veritabanı dosyası: `apps/api/data/karar.db`. Yüklenen görseller: `apps/api/uploads/`. İkisi de Git'e girmez.

## Yetkiler

| Rol                               | Katalog, içerik, medya | Ayarlar, mesajlar | Kullanıcılar |
| --------------------------------- | ---------------------- | ----------------- | ------------ |
| `owner` (ana kullanıcı, tek kişi) | ✓                      | ✓                 | ✓            |
| `admin`                           | ✓                      | ✓                 | –            |
| `editor`                          | ✓                      | –                 | –            |

- **Açık kayıt yok.** Kullanıcıları yalnızca owner panelden açar, düzenler ve siler.
- İkinci bir owner açılamaz. Owner kaydı yönetim uçlarından değiştirilemez; owner kendi şifresini `/auth/change-password` ile değiştirir.
- Pasifleştirilen veya şifresi sıfırlanan kullanıcının açık oturumları kapatılır.

## Güvenlik

- **Şifreler:** argon2id ile saklanır.
- **Oturum:** rastgele token httpOnly, `SameSite=Lax` çerezde tutulur (üretimde `Secure`). Veritabanında token'ın kendisi değil, SHA-256 özeti saklanır. Varsayılan süre 7 gün; süre yarıya inince otomatik uzatılır.
- **Giriş:** IP + e-posta başına hız sınırı var. Yanıt süresi ve mesajı, e-postanın kayıtlı olup olmadığını ele vermez.
- **CSRF:** Değiştirici istekler için `Origin` başlığı izinli kaynaklarla (`CORS_ORIGINS`) karşılaştırılır. Tarayıcılar bu başlığı her zaman gönderir. Komut satırından istek atarken `Origin` başlığını siz eklemelisiniz (bkz. `api.http`).
- **Yükleme:** En fazla 10 MB. Dosya türü uzantıya göre değil, içeriğine (magic bytes) göre doğrulanır: JPEG, PNG, WebP, AVIF. Dosyalara rastgele ad verilir.
- **İletişim formu:** IP başına hız sınırı ve gizli bot tuzağı alanı (`website`) var.
- **Hız sınırlarının kapsamı:** Sınırlar bellek içindedir, tek sunucu süreci için yeterlidir. Birden fazla örnek çalışacaksa Redis gibi paylaşılan bir depoya taşınmalıdır.

## Uç noktalar (`/api/v1`)

Hata gövdesi her yerde aynıdır: `{ "error": { "code", "message", "details?" } }`. Doğrulama hatalarında `details.fieldErrors` alan bazında mesaj içerir.

### Herkese açık

| Yöntem | Yol                                                        | Açıklama                                                           |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| GET    | `/health`                                                  | Sağlık kontrolü                                                    |
| GET    | `/site?locale=tr`                                          | Ayarlar (genel, iletişim, sosyal) + tüm içerik blokları, tek dilde |
| GET    | `/collections?locale=&category=carpet\|roll&featured=true` | Yayındaki koleksiyonlar ve modelleri                               |
| GET    | `/collections/:slug?locale=`                               | Koleksiyon detayı                                                  |
| GET    | `/collections/:slug/models/:model?locale=`                 | Model + renk seçenekleri + koleksiyondaki diğer desenler           |
| POST   | `/contact`                                                 | İletişim formu                                                     |

### Oturum

| Yöntem | Yol                     | Açıklama                                                      |
| ------ | ----------------------- | ------------------------------------------------------------- |
| POST   | `/auth/login`           | `{ email, password }` → çerez + kullanıcı                     |
| POST   | `/auth/logout`          | Oturumu kapatır                                               |
| GET    | `/auth/me`              | Oturumdaki kullanıcı                                          |
| POST   | `/auth/change-password` | `{ currentPassword, newPassword }`; diğer oturumlar kapatılır |

### Yönetim (`/admin`, oturum gerekir)

| Kaynak        | Uçlar                                                                                                                       | Rol     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| Panel özeti   | `GET /admin/dashboard`                                                                                                      | hepsi   |
| Kullanıcılar  | `GET, POST /admin/users` · `PATCH, DELETE /admin/users/:id`                                                                 | owner   |
| Renkler       | `GET, POST /admin/colors` · `PATCH, DELETE /admin/colors/:key`                                                              | editor+ |
| Koleksiyonlar | `GET, POST /admin/collections` · `GET, PATCH, DELETE /admin/collections/:id` · `POST /admin/collections/reorder`            | editor+ |
| Modeller      | `GET /admin/models?collectionId=` · `POST /admin/models` · `PATCH, DELETE /admin/models/:id` · `POST /admin/models/reorder` | editor+ |
| İçerik        | `GET /admin/content` · `GET, PUT /admin/content/:key`                                                                       | editor+ |
| Ayarlar       | `GET /admin/settings` · `PUT /admin/settings/:key`                                                                          | admin+  |
| Medya         | `GET /admin/media?page=` · `POST /admin/media` (multipart: `file`, `alt`) · `PATCH, DELETE /admin/media/:id`                | editor+ |
| Mesajlar      | `GET /admin/messages?status=&page=` · `GET, PATCH, DELETE /admin/messages/:id`                                              | admin+  |

**İçerik anahtarları:** `home.hero`, `home.featured`, `home.categories`, `home.story`, `home.values`, `company.stats`, `company.pillars`, `company.values`, `production.steps`, `about.page`, `collections.page`, `production.page`, `contact.page`, `cta`. Her bloğun verisi `{ tr: {...}, en: {...} }` biçimindedir. Alanlar `packages/shared/src/schemas/content.ts` içinde tanımlıdır.

**Ayar anahtarları:** `general`, `contact`, `social` (`packages/shared/src/schemas/settings.ts`).

Örnek istekler için [api.http](api.http) dosyasına bakın (VS Code REST Client / JetBrains HTTP Client).

## Yeni alan veya tablo eklemek

1. `src/db/schema.ts` dosyasını düzenleyin. Ardından `pnpm --filter @karar-hali/api db:generate --name <aciklama>` çalıştırın; `drizzle/` altında SQL üretilir ve commit'lenir.
2. Doğrulama şemasını `packages/shared` içinde tanımlayın. API, site ve panel aynı şemayı kullanır.
3. Route'u `src/routes/` altına ekleyin, `validate()` ile doğrulayın, yetkiyi `requireRole()` ile verin.
4. `test/` altında bellek içi veritabanıyla test yazın.
