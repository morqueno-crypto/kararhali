import { useEffect, type RefObject } from 'react'
import { gsap } from '@/lib/motion/gsap'

export interface IntroThread {
  /** viewBox içindeki yatay konum */
  x: number
  /** Durağan hâldeki hafif dalga genliği */
  sway: number
}

/** Girişteki iplik SVG'sinin viewBox ölçüleri */
export const THREAD_VIEWBOX = { width: 1000, height: 800 }

const SAMPLES = 40
/** İmlecin iplikleri ittiği yatay etki genişliği (viewBox birimi) */
const REACH = 85
/** En büyük itme miktarı */
const STRENGTH = 75
/** Bükülmenin dikey yayılımı */
const BEND = 170
// Yay fiziği: sertlik ve sönüm. Düşük sönüm = bırakınca tel gibi titreşir.
const STIFFNESS = 0.09
const DAMPING = 0.8

/** İpliğin yolu: hafif dalga + imlecin hizasında yana bükülme */
export function threadPath(thread: IntroThread, bulge = 0, bendY = THREAD_VIEWBOX.height / 2) {
  const { height } = THREAD_VIEWBOX
  let d = ''
  for (let i = 0; i <= SAMPLES; i += 1) {
    const y = -10 + (i * (height + 20)) / SAMPLES
    const wave = thread.sway * Math.sin((2 * Math.PI * (y + 10)) / (height + 20))
    const pull = bulge * Math.exp(-((y - bendY) ** 2) / (2 * BEND ** 2))
    d += `${i === 0 ? 'M' : 'L'}${(thread.x + wave + pull).toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

/**
 * Girişteki çözgü ipliklerini imlece duyarlı yapar: imleç yaklaştıkça iplikler iki yana açılır
 * (perde gibi aralanır), imleç uzaklaşınca yay fiziğiyle titreyerek yerine döner.
 * Yalnızca hareket izni varken çalışır; dokunmatikte parmak sürüklenirken de tepki verir.
 */
export function useThreadPluck(
  scope: RefObject<HTMLElement | null>,
  svg: RefObject<SVGSVGElement | null>,
  threads: readonly IntroThread[],
  enabled: boolean,
) {
  useEffect(() => {
    const section = scope.current
    const canvas = svg.current
    if (!enabled || !section || !canvas) return

    const paths = [...canvas.querySelectorAll<SVGPathElement>('[data-intro="thread"]')]
    const target = threads.map(() => 0)
    const current = threads.map(() => 0)
    const velocity = threads.map(() => 0)
    let bendY = THREAD_VIEWBOX.height / 2
    let bendTarget = bendY
    let running = false

    function tick() {
      let moving = false
      bendY += (bendTarget - bendY) * 0.2
      threads.forEach((thread, i) => {
        velocity[i] =
          ((velocity[i] ?? 0) + ((target[i] ?? 0) - (current[i] ?? 0)) * STIFFNESS) * DAMPING
        current[i] = (current[i] ?? 0) + (velocity[i] ?? 0)
        if (
          Math.abs(velocity[i] ?? 0) > 0.02 ||
          Math.abs((target[i] ?? 0) - (current[i] ?? 0)) > 0.05
        ) {
          moving = true
        }
        paths[i]?.setAttribute('d', threadPath(thread, current[i], bendY))
      })
      if (!moving) stop()
    }

    function start() {
      if (running) return
      running = true
      gsap.ticker.add(tick)
    }

    function stop() {
      running = false
      gsap.ticker.remove(tick)
    }

    function onMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * THREAD_VIEWBOX.width
      const y = ((event.clientY - rect.top) / rect.height) * THREAD_VIEWBOX.height
      bendTarget = y
      threads.forEach((thread, i) => {
        const dx = thread.x - x
        // Gauss türevi: imlecin iki yanındaki iplikler zıt yönlere itilir, uzaktakiler etkilenmez
        target[i] = STRENGTH * (dx / REACH) * Math.exp(0.5 - dx ** 2 / (2 * REACH ** 2))
      })
      start()
    }

    function onLeave() {
      target.fill(0)
      start()
    }

    section.addEventListener('pointermove', onMove)
    section.addEventListener('pointerleave', onLeave)
    return () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      stop()
    }
  }, [scope, svg, threads, enabled])
}
