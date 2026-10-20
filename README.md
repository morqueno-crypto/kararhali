# Karar Halı

Karar Halı için iki dilli (Türkçe / İngilizce), koyu temalı kurumsal site tasarımı. **Demo projedir:** backend yoktur. Logo, koleksiyonlar, model görselleri ve iletişim bilgileri [kararhali.com](https://www.kararhali.com)'dan alınmıştır; görseller oradan uzak URL ile yüklenir, bu yüzden geliştirme sırasında internet bağlantısı gerekir.

## Gereksinimler

- Node.js 24 LTS
- pnpm (`npm i -g pnpm` veya `corepack enable`)

## Kurulum ve çalıştırma

```bash
pnpm install
pnpm dev
```

Site http://localhost:5173 adresinde açılır ve tarayıcı diline göre `/tr` veya `/en` adresine yönlendirir.

## Komutlar

| Komut            | Açıklama                           |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Geliştirme sunucusu                |
| `pnpm build`     | Üretim derlemesi → `apps/web/dist` |
| `pnpm preview`   | Derlenmiş siteyi önizleme          |
| `pnpm lint`      | oxlint                             |
| `pnpm typecheck` | TypeScript kontrolü                |
| `pnpm test`      | Vitest testleri                    |
| `pnpm format`    | Prettier ile biçimlendirme         |

## Yapı

```
apps/web     → Statik frontend (Vite + React + TS + Tailwind v4 + React Router)
packages/    → İleride ortak paketler (ui, shared tipler)
```

Sayfalar: Ana sayfa, Kurumsal, Koleksiyonlar (halı / rulo kesim filtresi), Koleksiyon detayı (model ızgarası), Model detayı (fotoğraf, renk seçenekleri, ebatlar), Üretim, İletişim (demo form), 404. Her sayfa Türkçe ve İngilizce mevcuttur (ör. `/tr/koleksiyonlar/laguna/6055a-kahve` ↔ `/en/collections/laguna/6055a-kahve`).

## Dağıtım

`apps/web/dist` tamamen statiktir. SPA olduğu için sunucuda tüm yollar `index.html`'e yönlendirilmelidir (ör. Netlify `_redirects`: `/* /index.html 200`).

## Backend eklemek

`apps/api` olarak eklenir. Veri erişimi `apps/web/src/services` katmanında toplandığı için yalnızca servislerin içi değişir. Ayrıntılar için [CLAUDE.md](CLAUDE.md) dosyasına bakın.
