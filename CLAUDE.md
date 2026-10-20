# Lumen Halı — proje kuralları

Modern halı üretim fabrikası için kurumsal tanıtım sitesi (demo). Şu an backend yok; tüm içerik `apps/web/src/data/` altında statik ve örnektir.

## Teknoloji yığını

- pnpm workspaces + Turborepo (monorepo)
- `apps/web`: Vite + React 19 + TypeScript (strict) + Tailwind CSS v4 + React Router (data router, loader'lar)
- zod (env ve form doğrulama), lucide-react (ikonlar), Fontsource (Inter, Fraunces)
- oxlint + Prettier, Vitest + Testing Library, GitHub Actions CI

## Komutlar (kökten)

- `pnpm dev`: geliştirme sunucusu (http://localhost:5173)
- `pnpm build`: üretim derlemesi (`apps/web/dist`)
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm format`: Prettier

## Klasör yapısı (`apps/web/src`)

- `app/`: router, provider'lar, layout'lar
- `pages/`: route sayfaları (ince) + `*-loader.ts` dosyaları (loader'lar ayrı dosyada, Fast Refresh için)
- `features/<ad>/`: özellik modülleri; dışarıya yalnızca `index.ts` üzerinden açılır
- `components/ui`, `components/layout`: paylaşılan bileşenler
- `services/`: veri erişim katmanı (şimdi statik, sonra API)
- `data/`: statik içerik · `config/`: env.ts, site.ts · `lib/`: yardımcılar · `types/`: paylaşılan tipler
- `styles/globals.css`: Tailwind + `@theme` tasarım token'ları (cream, ink, madder, indigo)

## Mimari kurallar

1. Katmanlar tek yönlü: `pages → features → components/ui, hooks, lib, services`. `components/ui` feature import etmez.
2. Feature'lar birbirinin iç dosyalarını değil, yalnızca `index.ts` dosyasını import eder.
3. Veri yalnızca `services/` üzerinden alınır; bileşenler `fetch` çağırmaz, `data/` klasörünü doğrudan import etmez. Route verisi loader'larla yüklenir.
4. `import.meta.env` yalnızca `config/env.ts` içinde kullanılır; istemci env'leri `VITE_` ön eklidir.
5. Import alias `@/` → `src/`.
6. Dosyalar `kebab-case`, bileşenler `PascalCase`, named export.
7. Ana sayfa dışındaki route'lar `lazy` yüklenir.
8. Stil Tailwind utility'leriyle yazılır; renk ve font token'ları `@theme` içindedir; sınıflar `cn()` ile birleştirilir.
9. Semantik HTML ve erişilebilirlik (alt, aria, label); sayfa başlıkları `PageMeta` ile verilir.
10. TypeScript strict; `any` kullanılmaz.

## Backend eklenince

- `apps/api/` oluştur, `apps/web/vite.config.ts` içindeki `/api` proxy'sini aç, `VITE_API_URL` tanımla.
- `services/*` fonksiyonlarını `@/lib/http` ile API çağrısına çevir; bileşenler değişmez.
- FE ve BE'nin ortak tipleri ve şemaları için `packages/shared` oluştur.
