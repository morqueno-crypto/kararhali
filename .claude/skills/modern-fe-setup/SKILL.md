---
name: modern-fe-setup
description: Yeni bir web projesinin statik frontend iskeletini modern ve ölçeklenebilir bir altyapıyla kurar (pnpm workspaces + Turborepo monorepo, Vite + React + TypeScript + Tailwind CSS v4 + React Router, ESLint/Prettier, Vitest, GitHub Actions CI). İleride backend, ortak paketler veya yeni uygulamalar eklenebilecek bir klasör yapısı oluşturur. "Yeni web sitesi kur", "frontend projesi başlat", "proje iskeleti oluştur", "modern FE setup" gibi isteklerde veya /modern-fe-setup çağrıldığında kullan. Siteye özel içerik, tasarım veya sayfa detayına girmez; yalnızca altyapıyı kurar.
---

# Modern Frontend Proje Kurulumu

Bu skill, bir web sitesinin **statik frontend altyapısını** kurar. Amaç: bugün sadece statik FE olsa bile, yarın backend (API), ortak UI paketi, admin paneli vb. eklendiğinde yeniden yapılandırma gerektirmeyen bir temel.

**Kapsam dışı:** Siteye özel sayfalar, içerik, renk paleti, marka, metinler. Sadece iskelet, konfigürasyon ve örnek (boş) yapı taşları kurulur. Site detayları bu skill bittikten sonra ayrıca konuşulur.

## Teknoloji yığını

| Alan | Seçim | Neden |
|---|---|---|
| Paket yöneticisi | **pnpm** (Corepack ile) | Hızlı, disk dostu, workspace desteği |
| Monorepo | **pnpm workspaces + Turborepo** | Backend/paket eklemek = yeni klasör; görevler cache'li |
| Build/dev | **Vite** | Standart, çok hızlı, statik çıktı (`dist/`) |
| UI | **React** (güncel major) + **TypeScript** (strict) | Ekosistem, tip güvenliği |
| Stil | **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first `@theme`) | Config dosyasız, token tabanlı |
| Routing | **React Router** (güncel major, `react-router` paketi) | Data router, lazy route desteği |
| Env doğrulama | **zod** | Yanlış/eksik env build'de patlasın |
| Kod kalitesi | Şablonun linter'ı (güncel create-vite: **oxlint**; eski şablonlarda ESLint flat config) + **Prettier** (+ tailwind plugin) | Tutarlı stil |
| Test | **Vitest** + **Testing Library** + jsdom | Vite ile aynı config |
| CI | **GitHub Actions** | lint + typecheck + test + build |

Kurallar:
- Sürümleri **elle sabitleme**; kurulumda `pnpm add <paket>` ile o günün güncel kararlı sürümünü al. Bilinen bir major değişikliği varsa (ör. config formatı) resmi dokümana göre uyarla.
- Node için güncel **LTS** sürümünü kullan (`.nvmrc`'ye major yaz).
- Kurulan bir şablon (create-vite) farklı dosya üretirse, bu skill'deki **yapıyı ve kuralları** esas al, şablonun güncel konfig sözdizimini koru.

## Hedef klasör yapısı

```
<proje>/
├── apps/
│   └── web/                      # Statik frontend (Vite + React)
│       ├── public/               # Olduğu gibi kopyalanan dosyalar (favicon, robots.txt)
│       ├── src/
│       │   ├── app/              # Uygulama kabuğu
│       │   │   ├── providers.tsx # Global provider'lar (ileride QueryClient, Theme, Auth)
│       │   │   ├── router.tsx    # Tüm route tanımları
│       │   │   └── layouts/      # root-layout.tsx vb.
│       │   ├── pages/            # Route seviyesindeki ince sayfa bileşenleri
│       │   ├── features/         # Özellik bazlı modüller (her biri kendi components/hooks/services)
│       │   ├── components/
│       │   │   ├── ui/           # Saf, tekrar kullanılabilir UI (button, container...)
│       │   │   └── layout/       # header, footer gibi yerleşim parçaları
│       │   ├── hooks/            # Paylaşılan hook'lar
│       │   ├── lib/              # Yardımcılar: cn(), http client, formatlayıcılar
│       │   ├── services/         # Veri erişim katmanı (şimdi statik/mock, sonra API)
│       │   ├── data/             # Statik içerik/veri (backend gelene kadar)
│       │   ├── config/           # env.ts (zod), site.ts (site sabitleri)
│       │   ├── types/            # Paylaşılan tipler
│       │   ├── styles/           # globals.css (Tailwind + @theme token'ları)
│       │   ├── assets/           # Import edilen görseller/fontlar
│       │   ├── test/             # setup.ts, test yardımcıları
│       │   ├── main.tsx
│       │   └── vite-env.d.ts
│       ├── index.html
│       ├── vite.config.ts
│       ├── eslint.config.js
│       ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│       ├── .env.example
│       └── package.json
├── packages/                     # Ortak paketler (şimdilik boş, .gitkeep)
│                                 # ileride: ui/, config/, types/ (FE+BE ortak tipler)
├── .github/workflows/ci.yml
├── .editorconfig
├── .gitignore
├── .nvmrc
├── .prettierrc / .prettierignore
├── CLAUDE.md                     # Proje kuralları (gelecek oturumlar için)
├── README.md
├── package.json                  # Kök: sadece turbo/prettier + görev script'leri
├── pnpm-workspace.yaml
└── turbo.json
```

**İleride eklenecekler buraya oturur:**
- Backend → `apps/api/` (ör. Hono, NestJS, Fastify). Vite `server.proxy` ile `/api` yönlendirilir, `VITE_API_URL` env'i kullanılır.
- Ortak UI → `packages/ui/`, ortak tip/şema (zod) → `packages/shared/`.
- Admin paneli / ikinci site → `apps/admin/`.
- Sunucu tarafı veri önbellekleme → TanStack Query, `app/providers.tsx` içine eklenir.

## Mimari kurallar (projeye CLAUDE.md olarak da yazılır)

1. **Katmanlar tek yönlü:** `pages → features → components/ui, hooks, lib, services`. `components/ui` hiçbir feature'ı import etmez.
2. **Feature izolasyonu:** Her feature `features/<ad>/index.ts` üzerinden dışarı açılır. Başka bir feature'ın iç dosyalarına doğrudan import yok.
3. **Veri erişimi sadece `services/` üzerinden:** Bileşenler `fetch` çağırmaz ve `data/` klasörünü doğrudan import etmez. Bugün servis statik veriyi döner; backend gelince sadece servis içi değişir, bileşenler değişmez. Servis fonksiyonları baştan `async` yazılır.
4. **Env erişimi sadece `config/env.ts` üzerinden** (`import.meta.env` başka yerde kullanılmaz). İstemcide görünen tüm env'ler `VITE_` ön ekli; gizli anahtar asla FE env'ine konmaz.
5. **Import alias:** `@/` → `src/`. Göreli `../../` zincirleri yerine alias.
6. **İsimlendirme:** dosyalar `kebab-case.tsx`, bileşenler `PascalCase`, hook'lar `use-xxx.ts` dosyasında `useXxx`. Named export tercih edilir (lazy route modülleri hariç gerekirse).
7. **Sayfalar ince:** Sayfa bileşeni yerleşimi kurar, mantığı feature'lara bırakır. Ana sayfa dışındaki route'lar `lazy` ile yüklenir. Route verisi React Router **loader**'larıyla `services/` üzerinden alınır; loader'lar sayfa dosyasında değil ayrı `pages/<ad>-loader.ts` dosyasında durur (bileşen dosyası bileşen dışında bir şey export ederse Fast Refresh bozulur, linter uyarır). Aynı nedenle bileşen dosyasından yardımcı fonksiyon/sabit export edilmez (ör. `buttonClass` → `button-styles.ts`). Bir modül hem statik hem lazy import edilmez (ör. 404 sayfası error element'te de kullanılıyorsa statik yükle).
8. **Stil:** Tailwind utility'leri; tasarım token'ları `styles/globals.css` içindeki `@theme` bloğunda. Sınıf birleştirme için `cn()` (`clsx` + `tailwind-merge`).
9. **Erişilebilirlik/SEO temeli:** Semantik HTML, `index.html`'de `lang`, `meta description`, `viewport`; görsellerde `alt`.
10. **TypeScript strict;** `any` yok, gerekiyorsa `unknown` + daraltma.

## Kurulum adımları

Adımları sırayla uygula. Her adımda hata olursa düzeltmeden sonrakine geçme. Dosya içerikleri için [templates.md](templates.md) dosyasını oku ve kullan.

### 0. Bilgi topla
- Proje adı ve hedef klasör (varsayılan: mevcut çalışma dizini). Klasör boş değilse kullanıcıya sor, üzerine yazma.
- Sitenin dili (`<html lang>` için; varsayılan `tr`).
- Başka bir şey sorma; siteye özel detaylar bu skill'in kapsamı dışında.

### 1. Ortamı kontrol et
```bash
node -v
git --version
pnpm -v
```
- **Node veya Git yoksa:** kullanıcıya sor, onay verirse Windows'ta `winget install --id OpenJS.NodeJS.LTS -e` ve `winget install --id Git.Git -e` ile kur (macOS: `brew install node git`). Kurulumdan sonra aynı PowerShell oturumunda PATH'i yenile: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`. Bu yenilemeyi her yeni komutta tekrarla (kabuk durumu komutlar arasında korunmaz).
- **pnpm yoksa:** `npm i -g pnpm@latest` (Windows'ta `corepack enable` Program Files'a yazmak için yönetici izni ister). Global npm klasörünü PATH'e ekle: `$env:Path += ";$env:APPDATA\npm"`.
- Dev sunucusu için `.claude/launch.json` kullanılacaksa, uygulama süreci yeni PATH'i görmeyebilir; `runtimeExecutable` olarak node'un tam yolunu ver ve Vite'ı doğrudan çalıştır: `["apps/web/node_modules/vite/bin/vite.js", "apps/web", "--port", "5173", "--strictPort"]`.

### 2. Kök (monorepo) yapısı
- `git init` (repo değilse).
- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `.editorconfig`, `.nvmrc`, `.prettierrc`, `.prettierignore` dosyalarını templates.md'ye göre oluştur. `packageManager` alanına `pnpm -v` çıktısını yaz.
- `packages/.gitkeep` oluştur.
- `pnpm add -Dw turbo prettier prettier-plugin-tailwindcss`

### 3. Web uygulamasını oluştur
```bash
pnpm create vite@latest apps/web --template react-ts --no-interactive
```
- Komut etkileşimli soru sorarsa veya bayrak desteklenmiyorsa, şablonu oluşturmayı tamamla ama "install/start" adımını reddet; yine olmazsa dosyaları templates.md'ye göre elle oluştur.
- `apps/web/package.json` içindeki `name` → `@<proje>/web`.
- Demo dosyalarını sil: `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/*`, `public/icons.svg` / `public/vite.svg`, `apps/web/README.md`, `apps/web/.gitignore` (kökteki .gitignore yeterli).
- Şablonun getirdiği sürümlere bak (`apps/web/package.json`). React Router, Vitest, Testing Library gibi eklenen paketlerde yeni bir major geldiyse, şablon kodu yazmadan önce `node_modules/<paket>/package.json` içindeki `exports` alanından ve `.d.ts` dosyalarından API'nin hâlâ aynı olduğunu doğrula.

### 4. Bağımlılıkları ekle (`apps/web` içinde)
```bash
pnpm --filter @<proje>/web add react-router zod clsx tailwind-merge
pnpm --filter @<proje>/web add -D tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
- Şablon ESLint kullanıyorsa `eslint-config-prettier` da ekle; oxlint kullanıyorsa gerekmez.
- Gerekirse `@types/node` ekle (vite.config'de `node:url` için; güncel şablonda zaten var).
- Site ikon veya font isterse: `lucide-react` (ikon), `@fontsource-variable/<font>` (self-host font, CDN'siz).

### 5. Konfigürasyon ve iskelet dosyaları
templates.md'deki şu dosyaları yaz/güncelle:
- `vite.config.ts` (react + tailwind plugin, `@` alias, vitest ayarları, yorum satırında API proxy)
- `tsconfig.app.json` → `paths`, `types` ve açıkça `"strict": true` ekle (şablonun diğer ayarlarını koru; `baseUrl` kullanma)
- Linter: şablonunkini koru (oxlint ise `.oxlintrc.json` olduğu gibi kalır; ESLint ise `extends` sonuna `eslint-config-prettier` ekle)
- `package.json` script'leri: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:watch`
- `index.html` (lang, meta), `.env.example`
- `src/` altındaki tüm klasörler ve başlangıç dosyaları: `main.tsx`, `vite-env.d.ts`, `app/providers.tsx`, `app/router.tsx`, `app/layouts/root-layout.tsx`, `pages/home-page.tsx`, `pages/not-found-page.tsx`, `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `components/ui/container.tsx`, `lib/cn.ts`, `lib/http.ts`, `config/env.ts`, `config/site.ts`, `services/README.md`, `styles/globals.css`, `test/setup.ts`, `app/router.test.tsx`
- Boş kalan klasörlere (`features/`, `hooks/`, `data/`, `types/`, `assets/`) `.gitkeep` koy.
- İçerikler **jenerik yer tutucu** olmalı (ör. "Ana sayfa", site adı `config/site.ts`'den). Tasarım yapma.

### 6. Proje dokümanları ve CI
- `CLAUDE.md`: Teknoloji yığını, klasör yapısı ve "Mimari kurallar" bölümünü projeye kopyala + komutlar listesi.
- `README.md`: Kurulum (`pnpm install`), komutlar, klasör yapısının kısa açıklaması, backend ekleme notu.
- `.github/workflows/ci.yml` (templates.md). Action'ların güncel major sürümlerini kullan.

### 7. Doğrula
Kökten sırayla çalıştır, hepsi temiz geçmeli:
```bash
pnpm install
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
- Lint **0 uyarı** ile geçmeli; uyarıları bastırma, kaynağını düzelt.
- Testleri bir kez de `pnpm exec turbo run test --force` ile çalıştır. Turbo altında süreç daha yavaş olduğu için yarış durumları burada ortaya çıkar. URL değiştiren etkileşimlerden (filtre, navigasyon) sonra `waitFor` / `findBy*` kullan.
- Sonra dev sunucusunu başlat (preview aracıyla). Ana sayfayı, lazy bir sayfayı ve bilinmeyen bir route'taki 404'ü kontrol et. Mobil görünümü (375px) de kontrol et: yatay taşma olmamalı, menü çalışmalı. Konsolda hata olmamalı.

### 8. Raporla
Kısa özet: kurulan yığın, oluşan yapı, doğrulama sonuçları (başarısız olan varsa açıkça), çalıştırma komutları. Ardından "site detaylarına geçebiliriz" de; kendiliğinden site içeriği üretme.

## Dağıtım notu
Çıktı `apps/web/dist/` altında tamamen statiktir (Netlify, Vercel, Cloudflare Pages, GitHub Pages, Nginx). SPA olduğu için sunucuda tüm yolların `index.html`'e yönlendirilmesi gerekir (ör. Netlify `public/_redirects`: `/* /index.html 200`). Hedef platform belli olduğunda eklenir; bu skill platforma özel dosya eklemez.
