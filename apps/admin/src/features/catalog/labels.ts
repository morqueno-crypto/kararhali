import type { CollectionCategory } from '@karar-hali/shared'

export const categoryLabels: Record<CollectionCategory, string> = {
  carpet: 'Halı',
  roll: 'Rulo kesim',
}

/** Sık kullanılan ebatlar (tek tıkla eklenir) */
export const sizePresets: Record<CollectionCategory, string[]> = {
  carpet: ['80x150', '120x180', '160x230', '200x290', '250x350', '300x400'],
  roll: ['80xR', '100xR', '120xR', '150xR', '160xR', '200xR', '250xR', '300xR'],
}

/** "200x290" → "200 × 290 cm", "200xR" → "200 cm × rulo" */
export function formatSize(size: string) {
  const [width, height] = size.split('x')
  return height === 'R' ? `${width} cm × rulo` : `${width} × ${height} cm`
}
