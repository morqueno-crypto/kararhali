import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'

// Global provider'lar burada sarılır (ör. QueryClientProvider, ThemeProvider).
export function AppProviders() {
  return <RouterProvider router={router} />
}
