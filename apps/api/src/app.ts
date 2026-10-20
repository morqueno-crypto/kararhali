import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import type { AppBindings, AppDeps } from './context'
import { errorBody, handleError } from './lib/errors'
import { adminRoutes } from './routes/admin'
import { authRoutes } from './routes/auth'
import { publicRoutes } from './routes/public'

/** /api/v1 altındaki tüm uçlar. Tipi, admin panelinde hono/client ile tip güvenli istemci için dışa aktarılır. */
export const apiRoutes = new Hono<AppBindings>()
  .route('/', publicRoutes)
  .route('/auth', authRoutes)
  .route('/admin', adminRoutes)

export type ApiRoutes = typeof apiRoutes

export function createApp(deps: AppDeps) {
  const app = new Hono<AppBindings>()
  const trustedOrigins = [...deps.env.CORS_ORIGINS, new URL(deps.env.PUBLIC_URL).origin]

  app.use('*', async (c, next) => {
    c.set('deps', deps)
    await next()
  })
  app.use('*', secureHeaders({ crossOriginResourcePolicy: 'cross-origin' }))
  app.use('/api/*', cors({ origin: deps.env.CORS_ORIGINS, credentials: true }))
  // Form/multipart istekleri için Origin kontrolü (JSON istekleri zaten CORS ön kontrolünden geçer).
  app.use('/api/*', csrf({ origin: trustedOrigins }))

  // Yüklenen görseller: rastgele dosya adlı oldukları için uzun süre önbelleğe alınabilir.
  app.use(
    '/uploads/*',
    serveStatic({
      root: deps.env.UPLOAD_DIR,
      rewriteRequestPath: (path) => path.replace(/^\/uploads/, ''),
      onFound: (_path, c) => {
        c.header('Cache-Control', 'public, max-age=31536000, immutable')
      },
    }),
  )

  app.route('/api/v1', apiRoutes)

  app.notFound((c) => c.json(errorBody('not_found', 'Adres bulunamadı'), 404))
  app.onError(handleError)
  return app
}
