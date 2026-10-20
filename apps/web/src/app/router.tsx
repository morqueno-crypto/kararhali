import { createBrowserRouter, redirect, type RouteObject } from 'react-router'
import { AppErrorPage } from '@/app/layouts/app-error-page'
import { RootLayout } from '@/app/layouts/root-layout'
import {
  defaultLocale,
  detectLocale,
  locales,
  pageSegments,
  type Locale,
  type RouteHandle,
} from '@/i18n'
import { NotFoundPage } from '@/pages/not-found-page'
import { RouteErrorPage } from '@/pages/route-error-page'
import { getSite } from '@/services/site'

const handle = (page: RouteHandle['page']): RouteHandle => ({ page })

/**
 * Bir dilin tüm sayfaları: /tr/kurumsal, /en/about ...
 * Dil route'unun loader'ı site verisini (ayarlar + içerik) bir kez yükler; sayfa geçişlerinde
 * yeniden çekilmez. Sayfalar kendi verilerini (koleksiyonlar vb.) kendi loader'larıyla alır.
 * 404 dışındaki tüm sayfalar lazy yüklenir; GSAP yalnızca ana sayfanın paketindedir.
 */
function localeRoutes(locale: Locale): RouteObject {
  const segment = (page: keyof typeof pageSegments) => pageSegments[page][locale]

  return {
    id: `locale-${locale}`,
    path: locale,
    loader: () => getSite(locale),
    shouldRevalidate: () => false,
    element: <RootLayout locale={locale} />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          {
            index: true,
            handle: handle('home'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/home-page'),
                import('@/pages/home-loader'),
              ])
              return { Component: page.HomePage, loader: () => data.homeLoader(locale) }
            },
          },
          {
            path: segment('about'),
            handle: handle('about'),
            lazy: () => import('@/pages/about-page').then((m) => ({ Component: m.AboutPage })),
          },
          {
            path: segment('collections'),
            handle: handle('collections'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/collections-page'),
                import('@/pages/collections-loader'),
              ])
              return {
                Component: page.CollectionsPage,
                loader: () => data.collectionsLoader(locale),
              }
            },
          },
          {
            path: `${segment('collections')}/:slug`,
            handle: handle('collectionDetail'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/collection-detail-page'),
                import('@/pages/collection-detail-loader'),
              ])
              return {
                Component: page.CollectionDetailPage,
                loader: (args) => data.collectionDetailLoader(args, locale),
              }
            },
          },
          {
            path: `${segment('collections')}/:slug/:model`,
            handle: handle('modelDetail'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/model-detail-page'),
                import('@/pages/model-detail-loader'),
              ])
              return {
                Component: page.ModelDetailPage,
                loader: (args) => data.modelDetailLoader(args, locale),
              }
            },
          },
          {
            path: segment('production'),
            handle: handle('production'),
            lazy: () =>
              import('@/pages/production-page').then((m) => ({ Component: m.ProductionPage })),
          },
          {
            path: segment('contact'),
            handle: handle('contact'),
            lazy: () => import('@/pages/contact-page').then((m) => ({ Component: m.ContactPage })),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    hydrateFallbackElement: <div className="min-h-dvh bg-canvas" />,
    // Site verisi yüklenemezse (API kapalı vb.) layout da çizilemez; bağımsız hata sayfası gösterilir.
    errorElement: <AppErrorPage />,
    children: [
      // Kök adres: tarayıcı diline göre yönlendir.
      { index: true, loader: () => redirect(`/${detectLocale()}`) },
      ...locales.map(localeRoutes),
      // Dil öneki olmayan eski/yanlış adresler varsayılan dile yönlendirilir.
      { path: '*', loader: ({ params }) => redirect(`/${defaultLocale}/${params['*'] ?? ''}`) },
    ],
  },
]

export const router = createBrowserRouter(routes)
