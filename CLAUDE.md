# Karar Halı — proje kuralları

Karar Halı (kararhali.com) için iki dilli (Türkçe / İngilizce), koyu temalı kurumsal site tasarımı (demo). Şu an backend yok; içerik `apps/web/src/data/` altında statiktir.

- Koleksiyon adları, ebatlar, model görselleri, logo ve iletişim bilgileri kararhali.com'dan alınmıştır. Koleksiyon açıklama metinleri örnektir.
- Görseller kopyalanmaz; `VITE_ASSET_BASE_URL` (varsayılan `https://www.kararhali.com/assets/img`) üzerinden uzak URL ile yüklenir. URL'ler yalnızca `lib/assets.ts` içindeki `assetUrl()` ile üretilir. Uzak görseller `components/ui/remote-image.tsx` ile gösterilir (tembel yükleme + hata yer tutucusu).
- Her koleksiyonda sitedeki ilk 8 model listelenir. Model kaydı dosya adıdır (`6055A_KAHVE`); desen kodu, renk ve URL slug'ı (`6055a-kahve`) `services/collections.ts` içinde bu addan türetilir. Renk adları ve renk noktası değerleri `data/colors.ts`'te.
- Route'lar: `/tr/koleksiyonlar/:slug` (koleksiyon) ve `/tr/koleksiyonlar/:slug/:model` (model detayı).

## Teknoloji yığını

- pnpm workspaces + Turborepo (monorepo)
- `apps/web`: Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + React Router (data router, loader'lar)
- zod (env ve form doğrulama), lucide-react (ikonlar), Fontsource (Geist: gövde metni, Bricolage Grotesque: başlıklar)
- oxlint + Prettier, Vitest + Testing Library, GitHub Actions CI

## Komutlar (kökten)

- `pnpm dev`: geliştirme sunucusu (http://localhost:5173)
- `pnpm build`: üretim derlemesi (`apps/web/dist`)
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm format`: Prettier

## Klasör yapısı (`apps/web/src`)

- `app/`: router, provider'lar, layout'lar
- `i18n/`: dil ayarları (`config.ts`), dile göre URL parçaları (`routes.ts`), arayüz metinleri (`messages/tr.ts`, `messages/en.ts`), `useI18n` / `useAlternatePaths` hook'ları
- `pages/`: route sayfaları (ince) + `*-loader.ts` dosyaları (loader'lar ayrı dosyada, Fast Refresh için)
- `features/<ad>/`: özellik modülleri; dışarıya yalnızca `index.ts` üzerinden açılır
- `components/ui`, `components/layout`: paylaşılan bileşenler (`Reveal`, `Emphasis`, `CountUp`, `CustomCursor`, `CtaSection` ...)
- `lib/motion/`: animasyon altyapısı (bkz. "Animasyon" bölümü)
- `services/`: veri erişim katmanı (şimdi statik, sonra API)
- `data/`: statik içerik · `config/`: env.ts, site.ts · `lib/`: yardımcılar · `types/`: paylaşılan tipler
- `styles/globals.css`: Tailwind + `@theme` içinde anlamsal (rol bazlı) koyu tema token'ları: `canvas` (sayfa zemini), `surface` / `raised` (kart yüzeyleri), `line` (çizgiler), `ink` / `muted` / `subtle` (metin seviyeleri), `accent` / `accent-strong` / `on-accent` (vurgu), `paper` (beyaz zeminli ürün fotoğrafları için açık yüzey). Bileşenlerde ham renk (`bg-stone-900`, `#fff` vb.) kullanılmaz; açık tema eklenecekse sadece bu token değerleri değişir.

## Mimari kurallar

1. Katmanlar tek yönlü: `pages → features → components/ui, hooks, lib, services`. `components/ui` feature import etmez.
2. Feature'lar birbirinin iç dosyalarını değil, yalnızca `index.ts` dosyasını import eder.
3. Veri yalnızca `services/` üzerinden alınır; bileşenler `fetch` çağırmaz, `data/` klasörünü doğrudan import etmez. Route verisi loader'larla yüklenir.
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
- Bileşenlerde sabit metin yazılmaz. Metinler `const { t, path } = useI18n()` ile alınır. Linkler `path('about')` veya `path('collectionDetail', { slug })` ile üretilir; `/tr/...` elle yazılmaz.
- Yeni metin önce `messages/tr.ts`'e, sonra aynı anahtarla `messages/en.ts`'e eklenir. `en` dosyası `Messages` tipini uyguladığı için eksik anahtar derleme hatası verir.
- İçerik verisi `Localized<T>` (`{ tr, en }`) alanlarıyla tutulur. Servisler `locale` parametresi alır ve tek dile çevrilmiş veri döner.
- Her route'un `handle: { page }` alanı vardır. Dil seçici ve hreflang etiketleri, aynı sayfanın diğer dildeki adresini buradan bulur.
- Yeni sayfa eklerken: `pageSegments`'e ekle, `messages`'e `nav` metnini ekle, `router.tsx`'teki `localeRoutes` içine `handle` ile tanımla.
- Yeni dil eklerken: `config.ts`'teki `locales` listesine ekle, `messages/<dil>.ts` dosyasını oluştur, `pageSegments` ve `Localized` verilere o dilin karşılığını ekle.

## Backend eklenince

- `apps/api/` oluştur, `apps/web/vite.config.ts` içindeki `/api` proxy'sini aç, `VITE_API_URL` tanımla.
- `services/*` fonksiyonlarını `@/lib/http` ile API çağrısına çevir; bileşenler değişmez.
- FE ve BE'nin ortak tipleri ve şemaları için `packages/shared` oluştur.
