/*
 * Paylaşılan öğe geçişlerinin (React <ViewTransition name>) isimleri.
 * Aynı isim aynı anda yalnızca bir kez ekranda olmalıdır; kart ve detay sayfası bu yüzden
 * isimleri buradan alır.
 */
export const collectionImageTransition = (slug: string) => `collection-image-${slug}`

export const modelImageTransition = (collectionSlug: string, modelSlug: string) =>
  `model-image-${collectionSlug}-${modelSlug}`
