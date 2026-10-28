import { journeyChapterKeys } from '@karar-hali/shared'
import { gsap } from '@/lib/motion/gsap'
import {
  CARPET,
  CARPET_BOTTOM,
  CARPET_CENTER,
  CARPET_ROWS,
  cargoSlot,
  ROLL_THICKNESS,
  STAGE,
  WEAVE_ROW,
} from './scene-geometry'

/** Her bölüm zaman çizelgesinde 1 birim sürer; toplam süre = bölüm sayısı. */
export const CHAPTER_COUNT = journeyChapterKeys.length

/** Bölüm "tamamlandı" anı (0–1 arası ilerleme): bölüme gitme düğmeleri buraya kaydırır. */
export const chapterRestPoints = journeyChapterKeys.map((_, i) => (i + 0.9) / CHAPTER_COUNT)

/**
 * "Yok" ölçeği: 0 yerine çok küçük bir değer (tersinmez dönüşüm matrisinden kaçınmak için).
 * Ölçek/dönüş merkezleri transformOrigin ile (öğenin kendi kutusuna göre) verilir.
 */
const HIDDEN_SCALE = 0.001

/** Halı grubunun dönüşüm merkezi (svgOrigin): tüm konum hesapları buna göre yapılır */
const ORIGIN = CARPET_CENTER
const CARPET_SVG_ORIGIN = `${ORIGIN.x} ${ORIGIN.y}`

/**
 * Halı grubundaki bir noktayı (yerel koordinat) sahnede `target` noktasına, `scale` ölçeğiyle
 * getirecek x/y değerleri. GSAP svgOrigin ile: sahne = merkez + ölçek × (nokta − merkez) + (x, y)
 */
function placeCarpet(
  point: { x: number; y: number },
  target: { x: number; y: number },
  scale: number,
) {
  return {
    x: target.x - ORIGIN.x - scale * (point.x - ORIGIN.x),
    y: target.y - ORIGIN.y - scale * (point.y - ORIGIN.y),
    scale,
    svgOrigin: CARPET_SVG_ORIGIN,
  }
}

/** Rulonun (halının alt kenarının altında oluşan) yerel merkezi */
const ROLL_CENTER = { x: CARPET_CENTER.x, y: CARPET_BOTTOM + ROLL_THICKNESS / 2 }

/**
 * Sahnenin bütün hareketleri tek bir zaman çizelgesinde (kaydırmaya bağlanır, ileri/geri oynar).
 * Bölümler: 0 iplik · 1 tezgâh · 2 dokuma · 3 tıraş · 4 konfeksiyon · 5 kontrol · 6 paketleme · 7 sevkiyat
 */
export function buildJourneyTimeline(root: Element) {
  const q = gsap.utils.selector(root)

  // ── Başlangıç durumları ──────────────────────────────────────────
  gsap.set(q('[data-j="creel-frame"]'), { opacity: 0 })
  gsap.set(q('[data-j="bobbin"]'), { scale: HIDDEN_SCALE, transformOrigin: '50% 50%' })
  gsap.set(q('[data-j="thread"], [data-j="warp"], [data-j="stamp-check"], [data-j="route"]'), {
    strokeDashoffset: 1,
  })
  gsap.set(q('[data-j="loom-back"], [data-j="loom-front"]'), { opacity: 0 })
  gsap.set(q('[data-j="jacquard-light"]'), { opacity: 0.15 })
  gsap.set(
    q(
      '[data-j="shuttle"], [data-j="raw"], [data-j="blade"], [data-j="needle"], [data-j="end-band"]',
    ),
    {
      opacity: 0,
    },
  )
  // Saçaklar kısa kenarlardan dışarı doğru uzar
  gsap.set(q('[data-j="fringe-top"]'), { scaleY: HIDDEN_SCALE, transformOrigin: '50% 100%' })
  gsap.set(q('[data-j="fringe-bottom"]'), { scaleY: HIDDEN_SCALE, transformOrigin: '50% 0%' })
  gsap.set(q('[data-j="magnifier"]'), { opacity: 0, x: 420, y: 140 })
  gsap.set(q('[data-j="stamp"], [data-j="pin"], [data-j="label"]'), {
    scale: HIDDEN_SCALE,
    transformOrigin: '50% 50%',
  })
  gsap.set(q('[data-j="roll-lines"], [data-j="wrap"]'), { opacity: 0 })
  gsap.set(q('[data-j="truck"]'), { x: -1000, opacity: 0 })
  gsap.set(q('[data-j="cargo-roll"]'), { y: -260, opacity: 0 })
  gsap.set(q('[data-j="door"]'), { scaleX: HIDDEN_SCALE, transformOrigin: '0% 50%' })
  gsap.set(q('[data-j="wheel"]'), { transformOrigin: '50% 50%' })

  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 0.3 } })
  journeyChapterKeys.forEach((key, i) => tl.addLabel(key, i))

  // ── 1. İplik: bobinler dizilir, iplikler tezgâha uzanır ─────────
  tl.to(q('[data-j="creel-frame"]'), { opacity: 1, duration: 0.15 }, 0)
    .to(
      q('[data-j="bobbin"]'),
      { scale: 1, duration: 0.25, stagger: 0.012, ease: 'back.out(2)' },
      0.05,
    )
    .to(q('[data-j="loom-back"]'), { opacity: 0.25, duration: 0.25 }, 0.35)
    .to(q('[data-j="thread"]'), { strokeDashoffset: 0, duration: 0.4, stagger: 0.008 }, 0.4)

  // ── 2. Tezgâh: gövde belirir, çözgüler gerilir, jakar desen okur ──
  tl.to(q('[data-j="loom-back"], [data-j="loom-front"]'), { opacity: 1, duration: 0.2 }, 1)
    .to(q('[data-j="warp"]'), { strokeDashoffset: 0, duration: 0.35, stagger: 0.005 }, 1.1)
    .to(
      q('[data-j="jacquard-light"]'),
      { opacity: 1, duration: 0.04, stagger: { each: 0.006, from: 'random' } },
      1.25,
    )
    .to(q('[data-j="heddle-a"]'), { y: -8, duration: 0.1, repeat: 3, yoyo: true }, 1.5)
    .to(q('[data-j="heddle-b"]'), { y: 8, duration: 0.1, repeat: 3, yoyo: true }, 1.5)

  // ── 3. Dokuma: kamera yaklaşır; mekik gidip gelir, desen alttan yukarı sıra sıra açılır ──
  const step = 0.85 / CARPET_ROWS
  tl.to(q('[data-j="camera"]'), { scale: 1.2, svgOrigin: '710 330', duration: 0.25 }, 1.9).to(
    q('[data-j="shuttle"]'),
    { opacity: 1, duration: 0.03 },
    2,
  )
  for (let k = 0; k < CARPET_ROWS; k += 1) {
    const at = 2.05 + k * step
    const woven = (k + 1) * WEAVE_ROW
    const rowCenter = CARPET_BOTTOM - k * WEAVE_ROW - WEAVE_ROW / 2
    tl.fromTo(
      q('[data-j="shuttle"]'),
      { x: k % 2 === 0 ? 0 : CARPET.width, y: rowCenter },
      { x: k % 2 === 0 ? CARPET.width : 0, y: rowCenter, duration: step, ease: 'none' },
      at,
    )
      .to(
        q('[data-j="weave-clip"]'),
        { attr: { y: CARPET_BOTTOM - woven, height: woven }, duration: step, ease: 'none' },
        at,
      )
      .to(q('[data-j="beater"]'), { y: -woven, duration: step, ease: 'none' }, at)
  }
  tl.to(
    q('[data-j="heddle-a"]'),
    { y: -8, duration: step, repeat: CARPET_ROWS - 1, yoyo: true, ease: 'none' },
    2.05,
  )
    .to(
      q('[data-j="heddle-b"]'),
      { y: 8, duration: step, repeat: CARPET_ROWS - 1, yoyo: true, ease: 'none' },
      2.05,
    )
    .to(q('[data-j="shuttle"]'), { opacity: 0, duration: 0.03 }, 2.92)

  // ── 4. Tıraş ve apre: tezgâh sola itilir (push), halı ortaya süzülür (morph), bıçak yüzeyi eşitler ──
  tl.to(
    q('[data-j="creel"], [data-j="threads"], [data-j="loom-back"], [data-j="loom-front"]'),
    { x: -420, opacity: 0, duration: 0.35, ease: 'power3.in' },
    3,
  )
    .to(q('[data-j="camera"]'), { scale: 1, svgOrigin: '710 330', duration: 0.35 }, 3.05)
    .to(
      q('[data-j="carpet"]'),
      { ...placeCarpet(CARPET_CENTER, STAGE, STAGE.scale), duration: 0.4, ease: 'power3.inOut' },
      3.05,
    )
    .to(q('[data-j="raw"]'), { opacity: 1, duration: 0.1 }, 3.25)
    .to(q('[data-j="blade"]'), { opacity: 1, duration: 0.05 }, 3.4)
    .fromTo(
      q('[data-j="blade"]'),
      { y: 0 },
      { y: CARPET.height, duration: 0.42, ease: 'none' },
      3.42,
    )
    .to(
      q('[data-j="raw-veil"]'),
      { attr: { y: CARPET_BOTTOM, height: 0 }, duration: 0.42, ease: 'none' },
      3.42,
    )
    .to(q('[data-j="fuzz"]'), { opacity: 0, duration: 0.02, stagger: 0.4 / 80 }, 3.42)
    .to(q('[data-j="blade"]'), { opacity: 0, duration: 0.05 }, 3.86)

  // ── 5. Konfeksiyon: makine ince overloğu uzun kenarlara diker, kısa beyaz saçaklar takılır ──
  // İğne (needle-bob) sürekli iner kalkar; overlok şeridi iğnenin arkasından açılır.
  const sew = 0.27
  const [clipLeft, clipRight] = q('[data-j="overlock-clip"]')
  tl.to(q('[data-j="needle"]'), { opacity: 1, duration: 0.03 }, 4.03)
    .fromTo(
      q('[data-j="needle-bob"]'),
      { y: 0 },
      { y: 3, duration: 0.012, repeat: 47, yoyo: true, ease: 'sine.inOut' },
      4.05,
    )
    .fromTo(
      q('[data-j="needle"]'),
      { x: 0, y: 0 },
      { y: CARPET.height, duration: sew, ease: 'none' },
      4.05,
    )
    .to(clipLeft ?? [], { attr: { height: CARPET.height }, duration: sew, ease: 'none' }, 4.05)
    .set(q('[data-j="needle"]'), { x: CARPET.width, y: 0 }, 4.34)
    .to(q('[data-j="needle"]'), { y: CARPET.height, duration: sew, ease: 'none' }, 4.35)
    .to(clipRight ?? [], { attr: { height: CARPET.height }, duration: sew, ease: 'none' }, 4.35)
    .to(q('[data-j="needle"]'), { opacity: 0, duration: 0.04 }, 4.64)
    .to(q('[data-j="end-band"]'), { opacity: 1, duration: 0.05 }, 4.62)
    .to(
      q('[data-j="fringe-top"]'),
      { scaleY: 1, duration: 0.06, stagger: 0.2 / 80, ease: 'power2.out' },
      4.66,
    )
    .to(
      q('[data-j="fringe-bottom"]'),
      { scaleY: 1, duration: 0.06, stagger: 0.2 / 80, ease: 'power2.out' },
      4.68,
    )

  // ── 6. Kalite kontrol: büyüteç yüzeyi tarar, onay mührü basılır ──
  tl.to(q('[data-j="magnifier"]'), { opacity: 1, duration: 0.05 }, 5.02)
    .to(
      q('[data-j="magnifier"]'),
      {
        keyframes: [
          { x: 580, y: 230 },
          { x: 430, y: 380 },
          { x: 580, y: 500 },
          { x: 500, y: 320 },
        ],
        duration: 0.55,
        ease: 'power1.inOut',
      },
      5.05,
    )
    .to(q('[data-j="magnifier"]'), { opacity: 0, scale: 0.6, duration: 0.08 }, 5.62)
    .to(q('[data-j="stamp"]'), { scale: 1, duration: 0.12, ease: 'back.out(3)' }, 5.66)
    .to(q('[data-j="stamp-check"]'), { strokeDashoffset: 0, duration: 0.14 }, 5.74)

  // ── 7. Paketleme: halı boyuna, aşağı doğru rulo olur; rulo ortaya gelir, ambalajlanır, etiketlenir ──
  tl.to(q('[data-j="stamp"]'), { scale: HIDDEN_SCALE, duration: 0.08 }, 6)
    .to(
      q('[data-j="carpet-body"]'),
      {
        scaleY: 0.02,
        svgOrigin: `${CARPET_CENTER.x} ${CARPET_BOTTOM}`,
        duration: 0.45,
        ease: 'power1.in',
      },
      6.08,
    )
    .to(q('[data-j="fringes-bottom"]'), { opacity: 0, duration: 0.05 }, 6.08)
    .to(
      q('[data-j="roll-body"]'),
      { attr: { height: ROLL_THICKNESS }, duration: 0.45, ease: 'power1.in' },
      6.08,
    )
    .to(q('[data-j="roll-lines"]'), { opacity: 1, duration: 0.1 }, 6.4)
    .to(
      q('[data-j="carpet"]'),
      { ...placeCarpet(ROLL_CENTER, STAGE, STAGE.scale), duration: 0.25 },
      6.55,
    )
    .to(q('[data-j="wrap"]'), { opacity: 1, duration: 0.12 }, 6.62)
    .to(q('[data-j="label"]'), { scale: 1, duration: 0.12, ease: 'back.out(3)' }, 6.76)

  // ── 8. Sevkiyat: kamyon gelir, rulo kasadaki yerine süzülür (morph), diğerleri yüklenir, yola çıkılır ──
  const wheels = q('[data-j="wheel"]')
  const [rollBelow, rollMiddle, rollAbove] = q('[data-j="cargo-roll"]')
  const slot = cargoSlot(1)
  const slotScale = slot.width / (CARPET.width + 8)
  tl.to(q('[data-j="truck"]'), { opacity: 1, duration: 0.05 }, 7)
    .to(q('[data-j="truck"]'), { x: 0, duration: 0.22, ease: 'power3.out' }, 7)
    .to(wheels, { rotation: 360, duration: 0.22, ease: 'power3.out' }, 7)
    .to(q('[data-j="label"]'), { scale: HIDDEN_SCALE, duration: 0.06 }, 7.12)
    .to(
      q('[data-j="carpet"]'),
      {
        ...placeCarpet(
          ROLL_CENTER,
          { x: slot.x + slot.width / 2, y: slot.y + slot.height / 2 },
          slotScale,
        ),
        duration: 0.22,
        ease: 'power3.inOut',
      },
      7.16,
    )
    // Rulo yerine oturunca kasadaki eşi görünür, halı grubu gizlenir
    .set(rollMiddle ?? [], { y: 0, opacity: 1 }, 7.38)
    .set(q('[data-j="carpet"]'), { opacity: 0 }, 7.38)
    .to(
      [rollBelow, rollAbove].filter(Boolean),
      { y: 0, opacity: 1, duration: 0.1, stagger: 0.05, ease: 'power2.out' },
      7.3,
    )
    .to(q('[data-j="door"]'), { scaleX: 1, duration: 0.08 }, 7.47)
    .to(q('[data-j="truck"]'), { x: 1100, duration: 0.3, ease: 'power2.in' }, 7.57)
    .to(wheels, { rotation: 1080, duration: 0.3, ease: 'power2.in' }, 7.57)
    .to(q('[data-j="route"]'), { strokeDashoffset: 0, duration: 0.2, ease: 'none' }, 7.64)
    .to(q('[data-j="pin"]'), { scale: 1, duration: 0.08, stagger: 0.06, ease: 'back.out(3)' }, 7.72)

  // Toplam süre bölüm sayısına sabitlenir (ilerleme ↔ bölüm eşlemesi bunu varsayar)
  tl.set({}, {}, CHAPTER_COUNT)
  return tl
}
