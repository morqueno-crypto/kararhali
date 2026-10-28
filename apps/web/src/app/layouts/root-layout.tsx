import { useEffect, ViewTransition } from 'react'
import {
  Outlet,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
} from 'react-router'
import { CustomCursor } from '@/components/layout/custom-cursor'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { LocaleContext, messages, type Locale, type RouteHandle } from '@/i18n'
import { cn } from '@/lib/cn'
import { SmoothScrollProvider } from '@/lib/motion/smooth-scroll-provider'
import type { SiteData } from '@/services/site'
import { SiteContext } from '@/site'

export function RootLayout({ locale }: { locale: Locale }) {
  // Dil route'unun loader'ı (router.tsx → getSite) ayarları ve tüm içerikleri yükler.
  const site = useLoaderData<SiteData>()
  const navigation = useNavigation()
  const loading = navigation.state === 'loading'
  const transitionKey = usePageTransitionKey()

  // <html lang> sayfanın diliyle senkron tutulur (erişilebilirlik ve SEO).
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LocaleContext value={locale}>
      <SiteContext value={site}>
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
              {/*
               * Sayfa geçişi (React View Transition): anahtar değişince eski sayfa yukarı kayarak çıkar,
               * yenisi alttan gelir. Kart → detay görselleri ayrıca "morph" ile büyür (paylaşılan isimler).
               */}
              <ViewTransition
                key={transitionKey}
                enter="page-enter"
                exit="page-exit"
                default="none"
              >
                <div>
                  <Outlet />
                </div>
              </ViewTransition>
            </main>
            <SiteFooter />
            <CustomCursor />
            {/* Tam sayfa yüklemelerinde location.key hep "default" olur; o durumda yola göre sakla. */}
            <ScrollRestoration
              getKey={(location) => (location.key === 'default' ? location.pathname : location.key)}
            />
          </div>
        </SmoothScrollProvider>
      </SiteContext>
    </LocaleContext>
  )
}

/**
 * Sayfa geçişinin anahtarı: adres. İstisna: model detayında aynı desenin renkleri arasında geçiş
 * sayfayı değiştirmez; yalnızca görsel değişir (bkz. model-detail-page). Arama parametreleri
 * (ör. koleksiyon filtresi) adresin yol kısmını değiştirmediği için sayfa geçişi oynatmaz.
 */
function usePageTransitionKey() {
  const match = useMatches().at(-1)
  const location = useLocation()
  const page = (match?.handle as RouteHandle | undefined)?.page
  // Model adresi "<desen>-<renk>" biçimindedir (ör. 6055a-kahve); aynı desen = aynı sayfa
  if (page === 'modelDetail') {
    return `model:${match?.params.slug}:${match?.params.model?.split('-')[0]}`
  }
  return location.pathname
}
