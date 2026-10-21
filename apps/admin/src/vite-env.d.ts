/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API kökü; boşsa aynı adres (/api, geliştirmede Vite proxy). */
  readonly VITE_API_URL?: string
  /** "Sitede görüntüle" bağlantıları için sitenin adresi. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
