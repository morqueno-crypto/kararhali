import { createBrowserRouter, redirect, type RouteObject } from 'react-router'
import { RootLayout } from '@/app/layouts/root-layout'
import {
  defaultLocale,
  detectLocale,
  locales,
  pageSegments,
  type Locale,
  type RouteHandle,
} from '@/i18n'
import { homeLoader } from '@/pages/home-loader'
import { HomePage } from '@/pages/home-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { RouteErrorPage } from '@/pages/route-error-page'

const handle = (page: RouteHandle['page']): RouteHandle => ({ page })

/**
 * Bir dilin tüm sayfaları: /tr/kurumsal, /en/about ...
 * Ana sayfa ve 404 dışındaki sayfalar lazy yüklenir (ayrı JS parçaları).
 */
function localeRoutes(locale: Locale): RouteObject {
  const segment = (page: keyof typeof pageSegments) => pageSegments[page][locale]

  return {
    path: locale,
    element: <RootLayout locale={locale} />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
            loader: () => homeLoader(locale),
            handle: handle('home'),
          },
          {
            path: segment('about'),
            handle: handle('about'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/about-page'),
                import('@/pages/about-loader'),
              ])
              return { Component: page.AboutPage, loader: () => data.aboutLoader(locale) }
            },
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
            path: segment('production'),
            handle: handle('production'),
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/production-page'),
                import('@/pages/production-loader'),
              ])
              return { Component: page.ProductionPage, loader: () => data.productionLoader(locale) }
            },
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
    hydrateFallbackElement: <div className="min-h-dvh bg-cream-50" />,
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
