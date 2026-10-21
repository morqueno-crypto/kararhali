# Karar Halı — proje kuralları

Karar Halı (kararhali.com) için iki dilli (Türkçe / İngilizce), koyu temalı kurumsal site + API + yönetim paneli. Yol haritası: **1) backend/API → 2) sitenin API'ye bağlanması → 3) admin paneli** (üçü de tamam).

- **Veri kaynağı:** Sitedeki tüm içerik ve firma bilgileri API'den gelir (`apps/api`, SQLite). Kodda statik içerik yoktur. Başlangıç verisi API seed'indedir: koleksiyonlar, ebatlar, model görselleri, logo ve iletişim bilgileri kararhali.com'dan alınmıştır; koleksiyon açıklamaları örnek metindir.
- **Görseller:** Tam URL (şimdilik kararhali.com) veya API'nin servis ettiği `/uploads/...` yolu olarak gelir. `components/ui/remote-image.tsx` ile gösterilir (tembel yükleme + hata yer tutucusu).
- **Route'lar:** `/tr/koleksiyonlar/:slug` (koleksiyon) ve `/tr/koleksiyonlar/:slug/:model` (model detayı).

## Teknoloji yığını

- pnpm workspaces + Turborepo (monorepo)
- `apps/web`: Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + React Router (data router, loader'lar)
- `apps/api`: Hono + Drizzle ORM + SQLite (libSQL), argon2 ile şifreleme, çerez tabanlı oturum
- `apps/admin`: Vite + React 19 + TanStack Query + react-hook-form (zod resolver) + Radix UI + sonner + dnd-kit; fontlar Manrope (başlık) + Inter (gövde)
- `packages/shared`: zod şemaları ve tipler (API, site ve admin paneli ortak kullanır)
- zod (env ve form doğrulama), lucide-react (ikonlar), Fontsource (Geist: gövde metni, Bricolage Grotesque: başlıklar)
- oxlint + Prettier, Vitest + Testing Library, GitHub Actions CI

## Komutlar (kökten)

- `pnpm dev`: site (http://localhost:5173), panel (http://localhost:5174) ve API (http://localhost:3000/api/v1) birlikte
- `pnpm build`: üretim derlemeleri (`apps/web/dist`, `apps/admin/dist`, `apps/api/dist`)
- `pnpm --filter @karar-hali/api db:seed`: migration + başlangıç verisi + ana kullanıcı (`apps/api/.env` gerekir)
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm format`: Prettier

## Klasör yapısı (`apps/web/src`)

- `app/`: router, provider'lar, layout'lar (`root-layout.tsx`, API kapalıyken gösterilen `app-error-page.tsx`)
- `site/`: API'den gelen site verisi (ayarlar + içerik blokları) için `SiteContext`, `useSite()`, `useContent(key)`
- `i18n/`: dil ayarları (`config.ts`), dile göre URL parçaları (`routes.ts`), **yalnızca arayüz etiketleri** (`messages/tr.ts`, `messages/en.ts`), `useI18n` / `useAlternatePaths` hook'ları
- `pages/`: route sayfaları (ince) + `*-loader.ts` dosyaları (loader'lar ayrı dosyada, Fast Refresh için)
- `features/<ad>/`: özellik modülleri; dışarıya yalnızca `index.ts` üzerinden açılır
- `components/ui`, `components/layout`: paylaşılan bileşenler (`Reveal`, `Emphasis`, `CountUp`, `CustomCursor`, `CtaSection` ...)
- `lib/motion/`: animasyon altyapısı (bkz. "Animasyon" bölümü)
- `services/`: API ile konuşan tek katman (`site.ts`, `collections.ts`, `contact.ts`); istekler `lib/http.ts` üzerinden
- `config/`: env.ts, site.ts (menü yapısı) · `lib/`: yardımcılar · `types/`: `@karar-hali/shared` tiplerinin kısa adları
- `test/`: `api.ts` (testlerde gerçek API'yi bellek içi veritabanıyla aynı süreçte çalıştırır), `media.ts` (matchMedia sahtesi)
- `styles/globals.css`: Tailwind + `@theme` içinde anlamsal (rol bazlı) koyu tema token'ları: `canvas` (sayfa zemini), `surface` / `raised` (kart yüzeyleri), `line` (çizgiler), `ink` / `muted` / `subtle` (metin seviyeleri), `accent` / `accent-strong` / `on-accent` (vurgu), `paper` (beyaz zeminli ürün fotoğrafları için açık yüzey). Bileşenlerde ham renk (`bg-stone-900`, `#fff` vb.) kullanılmaz; açık tema eklenecekse sadece bu token değerleri değişir.

## Mimari kurallar

1. Katmanlar tek yönlü: `pages → features → components/ui, hooks, lib, services`. `components/ui` feature import etmez.
2. Feature'lar birbirinin iç dosyalarını değil, yalnızca `index.ts` dosyasını import eder.
3. Veri yalnızca `services/` üzerinden alınır; bileşenler `fetch` çağırmaz. Sayfa verisi (koleksiyonlar vb.) route loader'larıyla, site geneli içerik `useSite()` / `useContent()` ile alınır.
4. `import.meta.env` yalnızca `config/env.ts` içinde kullanılır; istemci env'leri `VITE_` ön eklidir.
5. Import alias `@/` → `src/`.
6. Dosyalar `kebab-case`, bileşenler `PascalCase`, named export.
7. 404 dışındaki tüm route'lar (ana sayfa dahil) `lazy` yüklenir. Ana sayfanın da lazy olmasının sebebi GSAP'ın yalnızca orada kullanılması; diğer sayfalar GSAP indirmez.
8. Stil Tailwind utility'leriyle yazılır; renk ve font token'ları `@theme` içindedir; sınıflar `cn()` ile birleştirilir.
9. Semantik HTML ve erişilebilirlik (alt, aria, label); sayfa başlıkları `PageMeta` ile verilir.
10. TypeScript strict; `any` kullanılmaz.

## Animasyon

**Kütüphaneler**

- **GSAP + ScrollTrigger** (`@gsap/react` → `useGSAP`): pin'li, kaydırmaya bağlı (scrub) sahneler ve hero girişi.
- **Lenis**: yumuşak kaydırma. Tüm sayfalarda `RootLayout` içindeki `SmoothScrollProvider` ile çalışır.
- **CSS / Tailwind**: hover efektleri, mikro etkileşimler, `Reveal` giriş animasyonları, sayfa geçişi.

**`lib/motion/` yapısı**

- `constants.ts`: easing/süre sabitleri ve medya sorguları (`FINE_POINTER_QUERY`, `DESKTOP_MOTION_QUERY`, `REDUCED_MOTION_QUERY`).
- `use-media-query.ts`: `useMediaQuery`, `useReducedMotion`, `matchesQuery`.
- `use-in-view.ts`: IntersectionObserver hook'u. Desteklenmezse hemen `true` döner.
- `smooth-scroll-provider.tsx`, `lenis-context.ts`, `use-lenis.ts`: Lenis sağlayıcısı ve erişim hook'u (GSAP'a bağımlı değil).
- `gsap.ts`: GSAP girişi (eklenti kaydı). **Yalnızca GSAP kullanan bölümler import eder**; barrel/index üzerinden yeniden export edilmez, yoksa GSAP her sayfanın paketine sızar.
- `use-scroll-trigger-sync.ts`: Lenis ↔ ScrollTrigger senkronu ve font/görsel yüklenince `refresh`. GSAP kullanan sayfada bir kez çağrılır (şu an `home-page.tsx`).
- `pointer-effects.ts`: `useTilt`, `useMagnetic`. Doğrudan style yazarlar (yeniden render yok).

**Kurallar**

- **Reduced-motion zorunlu:** `prefers-reduced-motion: reduce` açıksa GSAP sahneleri kurulmaz, Lenis oluşturulmaz, `Reveal` içeriği baştan görünür. CSS tarafında gizli başlangıç durumları yalnızca `@media (prefers-reduced-motion: no-preference)` içinde tanımlanır.
- **Ağır efektler:** tilt, mıknatıs ve özel imleç yalnızca `FINE_POINTER_QUERY` koşulunda çalışır. Pin'li yatay şerit ve üretim hikâyesi yalnızca `DESKTOP_MOTION_QUERY` koşulunda çalışır; mobilde basit liste olur.
- **Performans:** yalnızca `transform` ve `opacity` animasyonu yapılır. Tek istisna hero girişindeki tek seferlik `clip-path`.
- **Pin ve transform:** pin'li bir elemanın atalarında `transform` kalmamalı. Kalırsa o ata `position: fixed` için referans kutusu olur ve pin kayar. Bu yüzden sayfa geçişi animasyonu `backwards` dolgu moduyla çalışır.
- **`Reveal variant="mask"`:** sarmalayan eleman `overflow: hidden` olmalıdır. Gözlem kaydırılan elemanda değil, ebeveynde yapılır (kırpılan eleman hiç "görünür" sayılmaz).
- **Vurgulu kelimeler:** metin ve vurgu ayrı i18n anahtarlarıdır (`title` + `titleAccent`). `<Emphasis text accent />` veya `SectionHeading` / `PageHero` bileşenlerinin `titleAccent` prop'u kullanılır.

**Yeni bir scroll animasyonu eklemek**

1. Bileşeni ilgili `features/<ad>/` altında yaz. `gsap` ve `useGSAP`'ı `@/lib/motion/gsap`'tan import et.
2. Animasyonu `useGSAP(() => { ... }, { scope, dependencies })` içinde kur. Seçicileri `scope` ile sınırla; temizleme otomatiktir.
3. Kurulumdan önce `useReducedMotion()` veya `useMediaQuery(DESKTOP_MOTION_QUERY)` ile koşulu kontrol et ve yedek (animasyonsuz) bir görünüm sağla.
4. Pin kullanıyorsan `start: () => \`top ${header.offsetHeight}px\``, `invalidateOnRefresh: true`ver. Bileşen yeni bir sayfadaysa o sayfada`useScrollTriggerSync()` çağır.
5. Testlerde `src/test/media.ts` içindeki `setMediaMatcher` ile hareket iznini aç veya kapat. Varsayılan: reduced-motion açık.

## Çok dillilik (i18n)

- URL dil önekli: `/tr/...` ve `/en/...`. Sayfa yolları dile göre değişir (`/tr/kurumsal` ↔ `/en/about`); tanımları `i18n/routes.ts` içindeki `pageSegments`'te.
- `/` adresi tarayıcı diline göre yönlendirir: Türkçe ise `/tr`, değilse `/en`. Dil öneki olmayan adresler `/tr/...`'ye yönlendirilir.
- Bileşenlerde sabit metin yazılmaz. İki kaynak var:
  - **Arayüz etiketleri** (menü, butonlar, form etiketleri, hata mesajları): `const { t, path } = useI18n()`. Yeni etiket önce `messages/tr.ts`'e, sonra aynı anahtarla `messages/en.ts`'e eklenir. `en` dosyası `Messages` tipini uyguladığı için eksik anahtar derleme hatası verir.
  - **Sayfa içerikleri ve firma bilgileri** (başlıklar, metinler, görseller, iletişim): API'den, `useContent('home.hero')` / `useSite().settings`. Panelden düzenlenebilmeleri gereken her metin bu tarafta olmalıdır.
- Linkler `path('about')` veya `path('collectionDetail', { slug })` ile üretilir; `/tr/...` elle yazılmaz.
- API'ye her istekte `locale` gönderilir; API tek dile çevrilmiş veri döner.
- Her route'un `handle: { page }` alanı vardır. Dil seçici ve hreflang etiketleri, aynı sayfanın diğer dildeki adresini buradan bulur.
- Yeni sayfa eklerken: `pageSegments`'e ekle, `messages`'e `nav` metnini ekle, `router.tsx`'teki `localeRoutes` içine `handle` ile tanımla.
- Yeni dil eklerken: `config.ts`'teki `locales` listesine ekle, `messages/<dil>.ts` dosyasını oluştur, `pageSegments` ve `Localized` verilere o dilin karşılığını ekle.

## Backend (`apps/api`)

Ayrıntılar, uç noktalar ve yetki tablosu: [apps/api/README.md](apps/api/README.md).

- **Yapı:**
  - `src/db/`: şema, migration'lar (`drizzle/`), seed (`seed-data/`)
  - `src/routes/`: `public.ts`, `auth.ts`, `admin/*`
  - `src/services/`: tek dile çevirme, içerik ve ayar doğrulama
  - `src/lib/`: hata, oturum, şifre, hız sınırı
  - `test/`: bellek içi SQLite ile entegrasyon testleri
- **Uygulama fabrikası:** `createApp(deps)` veritabanı ve ayarları dışarıdan alır; testler bu sayede izole çalışır.
- **Doğrulama:** Tüm girdiler `@karar-hali/shared` içindeki zod şemalarıyla `validate()` üzerinden doğrulanır. Yeni şema önce `packages/shared`'e eklenir.
- **Yetki:** `requireAuth` + `requireRole(...)`. Kullanıcı yönetimi yalnızca `owner`'dadır; açık kayıt yoktur.
- **Çok dilli alanlar:** veritabanında `{ tr, en }` JSON olarak tutulur. Herkese açık uçlar `?locale=` ile tek dile indirger.
- **İçerik ve ayarlar:** İçerik blokları (`content_blocks`) ve ayarlar (`settings`) anahtar → JSON olarak saklanır. Şemaları `packages/shared/src/schemas/content.ts` ve `settings.ts` içindedir. Yeni düzenlenebilir bölüm = yeni anahtar + şema + seed.
- **Şema değişikliği:** `src/db/schema.ts` → `db:generate` → oluşan SQL commit'lenir. Sunucu açılışta bekleyen migration'ları uygular.
- **Seed:** idempotent'tir; yalnızca eksikleri ekler, paneldeki değişikliklerin üzerine yazmaz.
- **Hata biçimi:** `{ error: { code, message, details? } }`. Değiştirici isteklerde `Origin` başlığı zorunlu (CSRF).

## Yönetim paneli (`apps/admin`)

Tasarım: koyu, altın vurgulu, "kart" ağırlıklı (Behance "Zoon Admin Panel" referansı). Arayüz yalnızca Türkçedir; metinler bileşenlerde doğrudan yazılır (i18n yok).

- **Yapı:**
  - `app/`: router (`routes` + tarayıcı router'ı), `providers.tsx` (QueryClient, onay diyaloğu, Toaster; testler bellek içi router verir), layout'lar
  - `auth/`: oturum loader'ları (`requireUserLoader` → `/login?next=`), `permissions.ts` (`can(user, izin)`), `RoleGate`, `useUser()`
  - `features/<ad>/`: `api.ts` (TanStack Query hook'ları) + sayfalar. `media` dışa `index.ts` ile açılır (`ImageField`, `MediaPicker`, `Dropzone`)
  - `components/ui`: Button / `buttonClass`, `Field` (etiket + hata + aria, render-prop), Dialog, `useConfirm`, Tabs, Switch, Table, `SortableList` (dnd-kit), PageHeader, Thumb, feedback (Skeleton, EmptyState, QueryError)
  - `lib/`: `http.ts` (`/api/v1` öneki, çerezli istek, `HttpError` + `fieldErrors`), `form-errors.ts` (`applyApiErrors`: API alan hatalarını forma yazar), `format.ts`
- **Veri:** Bileşenler `fetch` çağırmaz; her özellik `features/<ad>/api.ts` hook'larını kullanır. Değişiklikten sonra ilgili sorgular (ve panel özeti) geçersiz kılınır; sıralama iyimser güncellenir.
- **Formlar:** react-hook-form + `zodResolver(<@karar-hali/shared şeması>)`. Doğrulama kuralları paylaşılan şemadadır, panelde tekrar yazılmaz. Sunucu hataları `applyApiErrors` ile alan bazında gösterilir.
- **İçerik düzenleyici:** `features/content/blocks.ts`, her içerik anahtarının alanlarını (etiket + kontrol tipi: text, textarea, image, stringList, imageList, items, stats) tanımlar. Yeni içerik bloğu = şema (`packages/shared`) + seed (API) + `blockDefs` girdisi. İki dilde aynı olan görseller birlikte güncellenir.
- **Yetki:** `can()` yalnızca arayüzü gizler; asıl kontrol API'dedir. Sayfalar `RoleGate` ile sarılır, menü role göre filtrelenir. İzinler API ile aynı tutulmalıdır.
- **Testler:** Site testleri gibi gerçek API'yi aynı süreçte kullanır (`src/test/api.ts`: çerez kavanozu + Origin başlığı). `signIn()` ile oturum açılır, `renderApp(path)` paneli bellek içi router ile açar. API giriş denemelerini dakikada 5 ile sınırladığı için bir test dosyasında 5'ten fazla giriş yapılmaz.

## Site ↔ API

- **Adres:** Site `/api` ve `/uploads` isteklerini aynı adrese yapar. Geliştirmede Vite proxy (`apps/web/vite.config.ts`, dev ve preview) bunları `localhost:3000`'e iletir; canlıda ikisi aynı alan adı altında yayınlanır. Farklı alan adında çalışacaksa `VITE_API_URL` verilir.
- **Site verisi:** Dil route'unun (`locale-tr`, `locale-en`) loader'ı `getSite(locale)` ile `/api/v1/site`'ı bir kez yükler (`shouldRevalidate: false`) ve `RootLayout` bunu `SiteContext` ile dağıtır. Zorunlu bir ayar veya içerik bloğu eksikse açık bir hata verilir.
- **Hatalar:** Site verisi yüklenemezse (API kapalı) en dıştaki `AppErrorPage` gösterilir; context'siz çalışır, dili adresten çıkarır. Sayfa içindeki hatalar `RouteErrorPage`'e, 404'ler `NotFoundPage`'e düşer.
- **Önbellek:** API herkese açık yanıtlara `Cache-Control: max-age=60` koyar. Panelde yapılan bir değişiklik normal gezintide en geç ~1 dakika içinde görünür; sayfayı yenileyince hemen görünür.
- **Testler:** Site testleri sahte veri değil, `@karar-hali/api/testing` ile aynı süreçte çalışan gerçek API'yi kullanır (bellek içi SQLite + seed). Bir isteği hatalı döndürmek için `failNextRequest(status, body)`. Bu yüzden site testleri API şemasındaki kırıcı değişiklikleri de yakalar.
