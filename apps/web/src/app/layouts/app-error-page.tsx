import { RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useRouteError } from 'react-router'
import { buttonClass } from '@/components/ui/button-styles'
import { defaultLocale, locales, messages, type Locale } from '@/i18n'

/**
 * En dış hata sınırı: site verisi (API) yüklenemediğinde gösterilir.
 * Layout ve context'ler olmadan çalışır; dili adresten çıkarır.
 */
export function AppErrorPage() {
  const error = useRouteError()
  const { pathname } = useLocation()
  const segment = pathname.split('/')[1]
  const locale: Locale = locales.includes(segment as Locale) ? (segment as Locale) : defaultLocale
  const t = messages[locale].error

  useEffect(() => {
    document.documentElement.lang = locale
    console.error(error)
  }, [locale, error])

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 text-center">
      <div className="max-w-md">
        <p className="font-display text-7xl font-semibold text-accent">!</p>
        <h1 className="mt-6 text-3xl font-semibold text-ink">{t.unavailable}</h1>
        <p className="mt-4 text-muted">{t.unavailableText}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonClass('primary', 'mt-8')}
        >
          <RotateCw className="size-4" aria-hidden="true" /> {t.retry}
        </button>
      </div>
    </main>
  )
}
