import { RotateCw } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/http'

/** Layout yüklenemediğinde (ör. API kapalı) gösterilen bağımsız hata sayfası. */
export function AppErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? error.statusText : errorMessage(error)

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="font-display text-5xl font-extrabold text-accent">!</p>
        <h1 className="mt-4 text-xl font-bold text-ink">Panel yüklenemedi</h1>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          <RotateCw /> Tekrar dene
        </Button>
      </div>
    </main>
  )
}
