import { env } from '@/config/env'

/** Görsel yolunu tam URL'ye çevirir (boşluk gibi karakterler kodlanır). */
export function assetUrl(path: string) {
  return `${env.VITE_ASSET_BASE_URL}/${encodeURI(path)}`
}
