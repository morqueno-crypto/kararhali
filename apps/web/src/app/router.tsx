import { createBrowserRouter, type RouteObject } from 'react-router'
import { RootLayout } from '@/app/layouts/root-layout'
import { homeLoader } from '@/pages/home-loader'
import { HomePage } from '@/pages/home-page'
import { NotFoundPage } from '@/pages/not-found-page'
import { RouteErrorPage } from '@/pages/route-error-page'

// Ana sayfa ve 404 dışındaki sayfalar lazy yüklenir (ayrı JS parçaları).
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    hydrateFallbackElement: <div className="min-h-dvh bg-cream-50" />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage />, loader: homeLoader },
          {
            path: 'kurumsal',
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/about-page'),
                import('@/pages/about-loader'),
              ])
              return { Component: page.AboutPage, loader: data.aboutLoader }
            },
          },
          {
            path: 'koleksiyonlar',
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/collections-page'),
                import('@/pages/collections-loader'),
              ])
              return { Component: page.CollectionsPage, loader: data.collectionsLoader }
            },
          },
          {
            path: 'koleksiyonlar/:slug',
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/collection-detail-page'),
                import('@/pages/collection-detail-loader'),
              ])
              return { Component: page.CollectionDetailPage, loader: data.collectionDetailLoader }
            },
          },
          {
            path: 'uretim',
            lazy: async () => {
              const [page, data] = await Promise.all([
                import('@/pages/production-page'),
                import('@/pages/production-loader'),
              ])
              return { Component: page.ProductionPage, loader: data.productionLoader }
            },
          },
          {
            path: 'iletisim',
            lazy: () => import('@/pages/contact-page').then((m) => ({ Component: m.ContactPage })),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
