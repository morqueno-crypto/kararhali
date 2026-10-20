import type { Messages } from '@/i18n'

/** "200x290" → "200 × 290 cm", "200xR" → "200 cm × rulo" */
export function formatSize(raw: string, t: Messages) {
  const [width = raw, height] = raw.toLowerCase().split('x')
  return height === 'r' ? t.collectionDetail.rollSize(width) : `${width} × ${height} cm`
}
