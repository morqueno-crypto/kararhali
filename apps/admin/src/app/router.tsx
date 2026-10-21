import { createBrowserRouter, type RouteObject } from 'react-router'
import { guestOnlyLoader, requireUserLoader } from '@/auth/session'
import { AdminLayout } from './layouts/admin-layout'
import { AppErrorPage } from './layouts/app-error-page'

const page = <T extends Record<string, unknown>>(load: () => Promise<T>, name: keyof T) => ({
  lazy: async () => ({ Component: (await load())[name] as React.ComponentType }),
})

export const routes: RouteObject[] = [
  {
    path: '/login',
    loader: guestOnlyLoader,
    errorElement: <AppErrorPage />,
    ...page(() => import('@/features/auth/login-page'), 'LoginPage'),
  },
  {
    id: 'admin',
    path: '/',
    loader: requireUserLoader,
    // Kullanıcı bilgisi oturum boyunca değişmez; her gezintide /auth/me çağrılmaz.
    shouldRevalidate: () => false,
    element: <AdminLayout />,
    errorElement: <AppErrorPage />,
    children: [
      {
        index: true,
        ...page(() => import('@/features/dashboard/dashboard-page'), 'DashboardPage'),
      },
      {
        path: 'collections',
        ...page(() => import('@/features/catalog/collections-page'), 'CollectionsPage'),
      },
      {
        path: 'collections/new',
        ...page(() => import('@/features/catalog/collection-editor-page'), 'CollectionEditorPage'),
      },
      {
        path: 'collections/:id',
        ...page(() => import('@/features/catalog/collection-editor-page'), 'CollectionEditorPage'),
      },
      { path: 'colors', ...page(() => import('@/features/catalog/colors-page'), 'ColorsPage') },
      { path: 'content', ...page(() => import('@/features/content/content-page'), 'ContentPage') },
      {
        path: 'content/:key',
        ...page(() => import('@/features/content/content-editor-page'), 'ContentEditorPage'),
      },
      { path: 'media', ...page(() => import('@/features/media/media-page'), 'MediaPage') },
      {
        path: 'messages',
        ...page(() => import('@/features/messages/messages-page'), 'MessagesPage'),
      },
      {
        path: 'settings',
        ...page(() => import('@/features/content/settings-page'), 'SettingsPage'),
      },
      { path: 'users', ...page(() => import('@/features/users/users-page'), 'UsersPage') },
      { path: 'profile', ...page(() => import('@/features/users/profile-page'), 'ProfilePage') },
      { path: '*', ...page(() => import('./layouts/not-found-page'), 'NotFoundPage') },
    ],
  },
]

export const router = createBrowserRouter(routes)
