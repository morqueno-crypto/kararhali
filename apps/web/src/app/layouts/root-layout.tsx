import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useMatches, useNavigation } from 'react-router'
import { CustomCursor } from '@/components/layout/custom-cursor'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { LocaleContext, messages, type Locale } from '@/i18n'
import { cn } from '@/lib/cn'
import { SmoothScrollProvider } from '@/lib/motion/smooth-scroll-provider'

export function RootLayout({ locale }: { locale: Locale }) {
  const navigation = useNavigation()
  const loading = navigation.state === 'loading'
  // Sayfa geçişi yalnızca route değişince oynar (aynı sayfada parametre değişimi, ör. renk seçimi, oynatmaz).
  const routeId = useMatches().at(-1)?.id

  // <html lang> sayfanın diliyle senkron tutulur (erişilebilirlik ve SEO).
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleContext value={locale}>
      <SmoothScrollProvider>
        <div className="flex min-h-dvh flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
          >
            {messages[locale].common.skipToContent}
          </a>
          <div
            aria-hidden="true"
            className={cn(
              'fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent transition-transform duration-500',
              loading ? 'scale-x-75' : 'scale-x-0',
            )}
          />
          <SiteHeader />
          <main id="main" className="flex-1">
            <div key={routeId} className="motion-safe:animate-page-in">
              <Outlet />
            </div>
          </main>
          <SiteFooter />
          <CustomCursor />
          {/* Tam sayfa yüklemelerinde location.key hep "default" olur; o durumda yola göre sakla. */}
          <ScrollRestoration
            getKey={(location) => (location.key === 'default' ? location.pathname : location.key)}
          />
        </div>
      </SmoothScrollProvider>
    </LocaleContext>
  )
}
