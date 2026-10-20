# Dosya şablonları

`<proje>` yerine proje adını (kebab-case), `<lang>` yerine site dilini yaz. Sürüm numaralarını elle yazma; `pnpm add` ile gelsin. Bir paketin güncel API'si buradakinden farklıysa güncel olanı kullan, yapıyı koru.

---

## Kök

### `package.json`
```json
{
  "name": "<proje>",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@<pnpm -v çıktısı>",
  "engines": {
    "node": ">=<LTS major>"
  },
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "preview": "turbo run preview",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "preview": { "dependsOn": ["build"], "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
```

### `.gitignore`
```gitignore
node_modules/
dist/
coverage/
.turbo/
*.log
.env
.env.*
!.env.example
.DS_Store
.vscode/*
!.vscode/extensions.json
.idea/
```

### `.editorconfig`
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### `.nvmrc`
```
<LTS major, ör. 24>
```

### `.prettierrc`
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "all",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./apps/web/src/styles/globals.css"
}
```

### `.prettierignore`
```
dist
coverage
.turbo
pnpm-lock.yaml
```

---

## `apps/web`

### `package.json` script'leri
```json
{
  "name": "@<proje>/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```
(Bağımlılık alanlarını `pnpm add` doldurur.)

### `vite.config.ts`
```ts
/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Backend (apps/api) eklendiğinde:
    // proxy: {
    //   '/api': { target: 'http://localhost:3000', changeOrigin: true },
    // },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```
Şablon `@vitejs/plugin-react-swc` kullandıysa onu koru.

### `tsconfig.app.json` — eklenecek alanlar
Şablonun `compilerOptions` ayarlarını koru (strict, moduleResolution: bundler, jsx vb.), şunları ekle/birleştir:
```json
{
  "compilerOptions": {
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Linter
Şablon oxlint kullanıyorsa (`.oxlintrc.json`, `"lint": "oxlint"`) dosyaya dokunma.

Şablon ESLint kullanıyorsa (`eslint.config.js`) dosyayı koru; sadece en üste import ekle ve `extends` dizisinin **sonuna** prettier'ı koy:
```js
import prettier from 'eslint-config-prettier'
// ...
extends: [/* şablondakiler */, prettier],
```
`globalIgnores` içine `'coverage'` ekle.

### `index.html`
```html
<!doctype html>
<html lang="<lang>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title><proje></title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
`public/favicon.svg` olarak basit bir yer tutucu SVG ve `public/robots.txt` (`User-agent: *\nAllow: /`) oluştur.

### `.env.example`
```
VITE_APP_NAME=<proje>
# Backend eklendiğinde:
# VITE_API_URL=http://localhost:3000
```

---

## `apps/web/src`

### `main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from '@/app/providers'
import '@/styles/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
```

### `vite-env.d.ts`
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### `app/providers.tsx`
```tsx
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'

// Global provider'lar burada sarılır (ör. QueryClientProvider, ThemeProvider).
export function AppProviders() {
  return <RouterProvider router={router} />
}
```

### `app/router.tsx`
```tsx
import { createBrowserRouter, type RouteObject } from 'react-router'
import { RootLayout } from '@/app/layouts/root-layout'
import { HomePage } from '@/pages/home-page'
import { NotFoundPage } from '@/pages/not-found-page'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    // İlk loader çalışırken gösterilir (yoksa React Router uyarı verir).
    hydrateFallbackElement: <div className="min-h-dvh" />,
    children: [
      { index: true, element: <HomePage /> },
      // Yeni sayfalar lazy yüklenir; loader ayrı dosyadadır:
      // {
      //   path: 'hakkimizda',
      //   lazy: async () => {
      //     const [page, data] = await Promise.all([
      //       import('@/pages/about-page'),
      //       import('@/pages/about-loader'),
      //     ])
      //     return { Component: page.AboutPage, loader: data.aboutLoader }
      //   },
      // },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
```
Loader'ları kullanan sayfa: `const data = useLoaderData<typeof aboutLoader>()` (`import type { aboutLoader } from './about-loader'`). Loader'da kayıt bulunamazsa `throw new Response('...', { status: 404 })` at ve bir `errorElement` içinde `isRouteErrorResponse(error) && error.status === 404` ise `NotFoundPage` göster.

Root layout'a `<ScrollRestoration />` ekle (sayfa geçişlerinde scroll'u en üste alır).

### `app/layouts/root-layout.tsx`
```tsx
import { Outlet } from 'react-router'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
```

### `components/layout/site-header.tsx`
```tsx
import { Link } from 'react-router'
import { Container } from '@/components/ui/container'
import { siteConfig } from '@/config/site'

export function SiteHeader() {
  return (
    <header className="border-b">
      <Container className="flex h-16 items-center">
        <Link to="/" className="font-semibold">
          {siteConfig.name}
        </Link>
      </Container>
    </header>
  )
}
```

### `components/layout/site-footer.tsx`
```tsx
import { Container } from '@/components/ui/container'
import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-sm">
      <Container>
        © {new Date().getFullYear()} {siteConfig.name}
      </Container>
    </footer>
  )
}
```

### `components/ui/container.tsx`
```tsx
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4', className)} {...props} />
}
```

### `pages/home-page.tsx`
```tsx
import { Container } from '@/components/ui/container'

export function HomePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold">Ana sayfa</h1>
    </Container>
  )
}
```

### `pages/not-found-page.tsx`
```tsx
import { Link } from 'react-router'
import { Container } from '@/components/ui/container'

export function NotFoundPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="mt-2">Sayfa bulunamadı.</p>
      <Link to="/" className="mt-4 inline-block underline">
        Ana sayfaya dön
      </Link>
    </Container>
  )
}
```
(Metinleri site diline göre yaz.)

### `lib/cn.ts`
```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `lib/http.ts`
```ts
import { env } from '@/config/env'

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

// Backend geldiğinde servisler bu fonksiyonu kullanır.
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.VITE_API_URL ?? ''}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) throw new HttpError(response.status, await response.text())
  return (await response.json()) as T
}
```

### `config/env.ts`
```ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_NAME: z.string().default('App'),
  VITE_API_URL: z.url().optional(),
})

export const env = envSchema.parse(import.meta.env)
```
(zod'un kurulu major sürümünde `z.url()` yoksa `z.string().url()` kullan.)

### `config/site.ts`
```ts
import { env } from '@/config/env'

export const siteConfig = {
  name: env.VITE_APP_NAME,
  description: '',
} as const
```

### `services/README.md`
```md
# services

Veri erişim katmanı. Bileşenler veriyi yalnızca buradaki fonksiyonlardan alır.

- Şimdi: fonksiyonlar `src/data/` altındaki statik veriyi `async` olarak döner.
- Backend gelince: aynı imzayla `@/lib/http` üzerinden API çağrısına çevrilir; bileşenler değişmez.

Örnek:
    export async function getItems(): Promise<Item[]> {
      return items            // sonra: return http<Item[]>('/api/items')
    }
```

### `styles/globals.css`
```css
@import 'tailwindcss';

/* Tasarım token'ları. Site detayları belli olunca doldurulur. */
@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
  }
}
```

### `test/setup.ts`
```ts
import '@testing-library/jest-dom/vitest'

// jsdom scrollTo desteklemez (ScrollRestoration kullanıyor).
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
```

### `app/router.test.tsx`
```tsx
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from '@/app/router'

describe('router', () => {
  it('ana sayfayı render eder', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('bilinmeyen route için 404 gösterir', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/olmayan-sayfa'] })
    render(<RouterProvider router={router} />)
    expect(await screen.findByText('404')).toBeInTheDocument()
  })
})
```

---

## CI — `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v5
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```
(Action sürümlerini kurulum anındaki güncel major ile değiştir.)
