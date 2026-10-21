import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'
import { ConfirmProvider } from '@/components/ui/confirm-provider'
import { createQueryClient } from '@/lib/query-client'
import { router as browserRouter } from './router'

type AppRouter = typeof browserRouter

/** Uygulama sağlayıcıları. Testler bellek içi bir router verir. */
export function AppProviders({ router = browserRouter }: { router?: AppRouter }) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: '!rounded-xl !border !border-line !bg-surface !text-ink !font-sans',
            description: '!text-muted',
          },
        }}
      />
    </QueryClientProvider>
  )
}
