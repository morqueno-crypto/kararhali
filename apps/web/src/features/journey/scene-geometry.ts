/** Üretim yolculuğu sahnesinin ölçüleri (journey-scene.tsx ve build-journey-timeline.ts ortak kullanır). */

export const SCENE = { width: 1000, height: 640 }

/** Desen görselinin en/boy oranı (assets/carpet-pattern.jpg: 640×1001) */
const PATTERN_RATIO = 640 / 1001

/** Halı (tezgâhtaki konumu); boy çözgü yönündedir */
const CARPET_HEIGHT = 400
const CARPET_WIDTH = Math.round(CARPET_HEIGHT * PATTERN_RATIO) // 256
export const CARPET = {
  x: 710 - CARPET_WIDTH / 2,
  y: 160,
  width: CARPET_WIDTH,
  height: CARPET_HEIGHT,
}
/** Dokuma sırası (her sırada mekik bir kez geçer) */
export const WEAVE_ROW = 20
export const CARPET_ROWS = CARPET.height / WEAVE_ROW // 20
export const CARPET_CENTER = {
  x: CARPET.x + CARPET.width / 2,
  y: CARPET.y + CARPET.height / 2,
}
export const CARPET_BOTTOM = CARPET.y + CARPET.height
/** Paketlemede halının altında oluşan rulonun kalınlığı */
export const ROLL_THICKNESS = 44

/** Tezgâhtan sonra halının sahnedeki konumu ve ölçeği */
export const STAGE = { x: 500, y: 320, scale: 1.25 }

/** Kamyon kasası ve içindeki rulo yuvaları (alttan üste) */
export const TRUCK = { x: 300, y: 330, cargoWidth: 330, cargoHeight: 190 }
export const cargoSlot = (index: number) => ({
  x: TRUCK.x + 20,
  y: TRUCK.y + 128 - index * 56,
  width: TRUCK.cargoWidth - 40,
  height: 46,
})
