import { cn } from '@/lib/cn'
import carpetPattern from '../assets/carpet-pattern.jpg'
import {
  CARPET,
  CARPET_BOTTOM,
  CARPET_CENTER,
  cargoSlot,
  ROLL_THICKNESS,
  SCENE,
  TRUCK,
} from '../scene-geometry'

/*
 * Üretim yolculuğunun tek parça sahnesi (1000×640). Bütün bölümler aynı SVG'dedir; hangi parçanın
 * ne zaman görüneceğini build-journey-timeline.ts belirler. Öğeler data-j özniteliğiyle seçilir.
 *
 * Sahne düzeni:
 *   bobinler (sol) → iplikler → tezgâh (sağ) içinde alttan yukarı dokunan halı (desen görseli)
 *   halı tezgâhtan çıkıp ortaya gelir → tıraş → ince overlok (uzun kenarlar) + kısa beyaz saçak
 *   → kontrol → boyuna rulo + ambalaj → rulo kamyondaki yerine süzülür → yola çıkış
 */

const palette = [
  'fill-wool-red',
  'fill-wool-cream',
  'fill-wool-navy',
  'fill-accent',
  'fill-accent-2',
]
const strokePalette = [
  'stroke-wool-red',
  'stroke-wool-cream',
  'stroke-wool-navy',
  'stroke-accent',
  'stroke-accent-2',
]

// Bobin rafı: 6 sıra × 4 sütun
const CREEL_ROWS = 6
const CREEL_COLS = 4
const bobbins = Array.from({ length: CREEL_ROWS * CREEL_COLS }, (_, i) => {
  const row = Math.floor(i / CREEL_COLS)
  const col = i % CREEL_COLS
  return { x: 62 + col * 56, y: 160 + row * 62, color: row % palette.length, index: i }
})

// Tezgâh: halı genişliğine göre
const LOOM = {
  left: CARPET.x - 46,
  right: CARPET.x + CARPET.width + 46,
  top: 100,
  bottom: 600,
}
const WARP_COUNT = 27
const warps = Array.from(
  { length: WARP_COUNT },
  (_, i) => CARPET.x + 3 + (i * (CARPET.width - 6)) / (WARP_COUNT - 1),
)
const JACQUARD = { x: LOOM.left - 10, width: LOOM.right - LOOM.left + 20, cols: 14 }

// Tıraş öncesi kabarık yüzey (y'ye göre sıralı; bıçak yukarıdan aşağı geçerken sırayla kaybolur)
const FUZZ_COUNT = 80
const fuzz = Array.from({ length: FUZZ_COUNT }, (_, i) => {
  const y = CARPET.y + 8 + (i * (CARPET.height - 16)) / (FUZZ_COUNT - 1)
  const x = CARPET.x + 6 + ((i * 53) % (CARPET.width - 14))
  return { x, y, h: 5 + ((i * 7) % 7) }
})

// Saçak: kısa kenarlarda sık, ince, kısa; her biri iki büküm ipten ve dibinde bir düğümden oluşur
const FRINGE_STEP = 2.8
const END_BAND = 3 // kısa kenarlardaki ince kilim bitim bandı
const fringeXs = Array.from(
  { length: Math.floor((CARPET.width - 4) / FRINGE_STEP) + 1 },
  (_, i) => CARPET.x + 2 + i * FRINGE_STEP,
)
/** Saçak boyu ve eğimi: hafif düzensiz (el işi hissi), sabit sözde-rastgele */
const fringeLength = (i: number) => 6.5 + ((i * 7) % 5) * 0.45
const fringeLean = (i: number) => ((i * 11) % 7) * 0.22 - 0.66

/** İki ipin bükülerek aşağı/yukarı sarktığı saçak yolu (dir: -1 yukarı, 1 aşağı) */
function fringePath(x: number, edge: number, i: number, dir: 1 | -1) {
  const len = fringeLength(i) * dir
  const lean = fringeLean(i) * (dir === -1 ? 1 : -1)
  const tipX = x + lean
  const tipY = edge + len
  const strandA = `M${x - 0.5} ${edge} C ${x - 0.6} ${edge + len * 0.4}, ${tipX + 0.4} ${edge + len * 0.6}, ${tipX} ${tipY}`
  const strandB = `M${x + 0.5} ${edge} C ${x + 0.6} ${edge + len * 0.35}, ${tipX - 0.4} ${edge + len * 0.7}, ${tipX} ${tipY}`
  return `${strandA} ${strandB}`
}

const wheels = [
  { cx: 370, cy: 540 },
  { cx: 560, cy: 540 },
  { cx: 700, cy: 540 },
]

/** Overlok şeridi: kenarı saran ince, sık ilmekler (desen) + halıya düşen hafif gölge */
function Overlock({ side }: { side: 'left' | 'right' }) {
  const width = 4
  const x = side === 'left' ? CARPET.x - width / 2 : CARPET.x + CARPET.width - width / 2
  const inner = side === 'left' ? x + width + 0.4 : x - 0.4
  return (
    <g clipPath={`url(#journey-overlock-${side})`}>
      <line
        x1={inner}
        y1={CARPET.y}
        x2={inner}
        y2={CARPET_BOTTOM}
        className="stroke-canvas/30"
        strokeWidth="1"
      />
      <rect
        x={x}
        y={CARPET.y}
        width={width}
        height={CARPET.height}
        rx="1.2"
        className="fill-paper"
      />
      <rect
        x={x}
        y={CARPET.y}
        width={width}
        height={CARPET.height}
        rx="1.2"
        fill="url(#journey-overlock-stitch)"
      />
    </g>
  )
}

export function JourneyScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      className={cn('overflow-hidden', className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* Sahnede tek örnek olduğu için sabit id'ler kullanılır */}
      <defs>
        {/* Dokunmuş kısım: alttan yukarı büyüyen kırpma */}
        <clipPath id="journey-weave-clip">
          <rect
            data-j="weave-clip"
            x={CARPET.x}
            y={CARPET_BOTTOM}
            width={CARPET.width}
            height="0"
          />
        </clipPath>
        {/* Overlok: iğne indikçe yukarıdan aşağı açılır */}
        <clipPath id="journey-overlock-left">
          <rect data-j="overlock-clip" x={CARPET.x - 4} y={CARPET.y} width="10" height="0" />
        </clipPath>
        <clipPath id="journey-overlock-right">
          <rect
            data-j="overlock-clip"
            x={CARPET.x + CARPET.width - 6}
            y={CARPET.y}
            width="10"
            height="0"
          />
        </clipPath>
        {/* Overlok ilmeği: kenara çapraz sarılan ince iplik (kum beji) */}
        <pattern id="journey-overlock-stitch" width="4" height="1.6" patternUnits="userSpaceOnUse">
          <path
            d="M0 0.2 L4 1.4"
            className="stroke-subtle"
            strokeWidth="0.55"
            strokeLinecap="round"
          />
        </pattern>
      </defs>

      {/* Kamera: dokumada tezgâha yaklaşır, sonra geri çekilir (tüm sahne bu grupta) */}
      <g data-j="camera">
        {/* ── Bobinler ──────────────────────────────────────────── */}
        <g data-j="creel">
          <g data-j="creel-frame" className="stroke-line" strokeWidth="6" strokeLinecap="round">
            <line x1="40" y1="120" x2="40" y2="530" />
            <line x1="290" y1="120" x2="290" y2="530" />
            {Array.from({ length: CREEL_ROWS }, (_, row) => (
              <line
                key={row}
                x1="40"
                y1={174 + row * 62}
                x2="290"
                y2={174 + row * 62}
                strokeWidth="3"
              />
            ))}
          </g>
          {bobbins.map((bobbin) => (
            <g key={bobbin.index} data-j="bobbin">
              <rect
                x={bobbin.x - 6}
                y={bobbin.y - 16}
                width="6"
                height="32"
                rx="2"
                className="fill-wool-cream/70"
              />
              <path
                d={`M${bobbin.x} ${bobbin.y - 14} L${bobbin.x + 30} ${bobbin.y - 6} L${bobbin.x + 30} ${bobbin.y + 6} L${bobbin.x} ${bobbin.y + 14}Z`}
                className={palette[bobbin.color]}
              />
              <path
                d={`M${bobbin.x + 6} ${bobbin.y - 10} L${bobbin.x + 6} ${bobbin.y + 10} M${bobbin.x + 14} ${bobbin.y - 9} L${bobbin.x + 14} ${bobbin.y + 9} M${bobbin.x + 22} ${bobbin.y - 7} L${bobbin.x + 22} ${bobbin.y + 7}`}
                className="stroke-canvas/25"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </g>

        {/* Bobinlerden tezgâha uzanan iplikler */}
        <g data-j="threads" fill="none" strokeWidth="1.6">
          {bobbins.map((bobbin, i) => {
            const fromX = bobbin.x + 32
            const toX = CARPET.x + 3 + (i * (CARPET.width - 6)) / (bobbins.length - 1)
            return (
              <path
                key={bobbin.index}
                data-j="thread"
                d={`M${fromX} ${bobbin.y} C ${fromX + 160} ${bobbin.y}, ${toX - 120} 60, ${toX} ${LOOM.top + 30}`}
                pathLength={1}
                strokeDasharray="1"
                className={cn(strokePalette[bobbin.color], 'opacity-80')}
              />
            )
          })}
        </g>

        {/* ── Tezgâh (arka): gövde, jakar, çözgü, gücü çerçeveleri ───── */}
        <g data-j="loom-back">
          <rect
            x={JACQUARD.x}
            y="28"
            width={JACQUARD.width}
            height="64"
            rx="10"
            className="fill-surface stroke-line"
            strokeWidth="2"
          />
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: JACQUARD.cols }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                data-j="jacquard-light"
                x={JACQUARD.x + 14 + (col * (JACQUARD.width - 40)) / (JACQUARD.cols - 1)}
                y={40 + row * 16}
                width="12"
                height="8"
                rx="2"
                className={(row + col) % 3 === 0 ? 'fill-accent' : 'fill-accent-2'}
              />
            )),
          )}
          <line
            x1={CARPET_CENTER.x}
            y1="92"
            x2={CARPET_CENTER.x}
            y2={LOOM.top}
            className="stroke-line"
            strokeWidth="4"
          />
          <rect
            x={LOOM.left}
            y={LOOM.top}
            width={LOOM.right - LOOM.left}
            height="30"
            rx="6"
            className="fill-raised stroke-line"
            strokeWidth="2"
          />
          <rect
            x={LOOM.left}
            y={LOOM.top}
            width="16"
            height={LOOM.bottom - LOOM.top}
            rx="4"
            className="fill-raised stroke-line"
            strokeWidth="2"
          />
          <rect
            x={LOOM.right - 16}
            y={LOOM.top}
            width="16"
            height={LOOM.bottom - LOOM.top}
            rx="4"
            className="fill-raised stroke-line"
            strokeWidth="2"
          />
          <g data-j="warps" className="stroke-wool-cream/60" strokeWidth="1.2">
            {warps.map((x) => (
              <line
                key={x}
                data-j="warp"
                x1={x}
                y1={LOOM.top + 30}
                x2={x}
                y2={CARPET_BOTTOM + 12}
                pathLength={1}
                strokeDasharray="1"
              />
            ))}
          </g>
          <rect
            data-j="heddle-a"
            x={CARPET.x - 8}
            y="134"
            width={CARPET.width + 16}
            height="6"
            rx="3"
            className="fill-wool-navy stroke-line"
          />
          <rect
            data-j="heddle-b"
            x={CARPET.x - 8}
            y="146"
            width={CARPET.width + 16}
            height="6"
            rx="3"
            className="fill-wool-navy stroke-line"
          />
          <rect
            x={LOOM.left}
            y={CARPET_BOTTOM + 12}
            width={LOOM.right - LOOM.left}
            height="26"
            rx="13"
            className="fill-raised stroke-line"
            strokeWidth="2"
          />
        </g>

        {/* Sevkiyat parçaları halının ARKASINDA çizilir: rulo kasadaki yerine süzülürken görünür kalır */}
        {/* ── Sevkiyat ──────────────────────────────────────────── */}
        <path
          data-j="route"
          d="M720 470 C 820 470, 840 330, 900 300 S 980 160, 940 110"
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          className="stroke-accent"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {[
          { x: 900, y: 300 },
          { x: 960, y: 200 },
          { x: 940, y: 110 },
        ].map((pin, i) => (
          <g key={i} data-j="pin">
            <path
              d={`M${pin.x} ${pin.y} c -14 -18 -20 -26 -20 -36 a 20 20 0 0 1 40 0 c 0 10 -6 18 -20 36z`}
              className={i === 2 ? 'fill-accent-2' : 'fill-accent'}
            />
            <circle cx={pin.x} cy={pin.y - 37} r="7" className="fill-canvas" />
          </g>
        ))}

        <g data-j="truck">
          {/* Yük kasası (kesit: içi görünür) */}
          <rect
            x={TRUCK.x}
            y={TRUCK.y}
            width={TRUCK.cargoWidth}
            height={TRUCK.cargoHeight}
            rx="10"
            className="fill-surface stroke-line"
            strokeWidth="3"
          />
          {[0, 1, 2].map((i) => {
            const slot = cargoSlot(i)
            return (
              <g key={i} data-j="cargo-roll">
                <rect
                  x={slot.x}
                  y={slot.y}
                  width={slot.width}
                  height={slot.height}
                  rx={slot.height / 2}
                  className={
                    i === 1 ? 'fill-wool-cream' : i === 0 ? 'fill-wool-red' : 'fill-wool-navy'
                  }
                />
                <ellipse
                  cx={slot.x + slot.width - 10}
                  cy={slot.y + slot.height / 2}
                  rx="9"
                  ry="20"
                  className="fill-paper/80"
                />
                {Array.from({ length: 5 }, (_, k) => (
                  <line
                    key={k}
                    x1={slot.x + 40 + k * 50}
                    y1={slot.y}
                    x2={slot.x + 20 + k * 50}
                    y2={slot.y + slot.height}
                    className="stroke-paper/50"
                    strokeWidth="2.5"
                  />
                ))}
              </g>
            )
          })}
          <rect
            data-j="door"
            x={TRUCK.x}
            y={TRUCK.y}
            width={TRUCK.cargoWidth}
            height={TRUCK.cargoHeight}
            rx="10"
            className="fill-raised stroke-line"
            strokeWidth="3"
          />
          {/* Kabin */}
          <path
            d={`M${TRUCK.x + TRUCK.cargoWidth + 8} 400 h 90 l 44 60 v 60 h -134 z`}
            className="fill-accent stroke-canvas/30"
            strokeWidth="3"
          />
          <path
            d={`M${TRUCK.x + TRUCK.cargoWidth + 24} 414 h 66 l 32 44 h -98 z`}
            className="fill-canvas/70"
          />
          <rect x={TRUCK.x - 10} y="518" width="472" height="14" rx="7" className="fill-raised" />
          {wheels.map((wheel) => (
            <g key={wheel.cx} data-j="wheel">
              <circle
                cx={wheel.cx}
                cy={wheel.cy}
                r="28"
                className="fill-canvas stroke-line"
                strokeWidth="6"
              />
              <circle cx={wheel.cx} cy={wheel.cy} r="9" className="fill-subtle" />
              <line
                x1={wheel.cx - 18}
                y1={wheel.cy}
                x2={wheel.cx + 18}
                y2={wheel.cy}
                className="stroke-subtle"
                strokeWidth="4"
              />
            </g>
          ))}
        </g>
        {/* ── Halı ──────────────────────────────────────────────── */}
        <g data-j="carpet">
          {/* Rulo (paketlemede halının altında oluşur; dokuma sırasında yok) */}
          <g data-j="roll">
            <rect
              data-j="roll-body"
              x={CARPET.x - 4}
              y={CARPET_BOTTOM}
              width={CARPET.width + 8}
              height="0"
              rx={ROLL_THICKNESS / 2}
              className="fill-wool-cream stroke-canvas/30"
              strokeWidth="1.5"
            />
            <g data-j="roll-lines" className="stroke-accent/35" strokeWidth="1.5">
              {[0.3, 0.55, 0.8].map((f) => (
                <line
                  key={f}
                  x1={CARPET.x + 6}
                  y1={CARPET_BOTTOM + f * ROLL_THICKNESS}
                  x2={CARPET.x + CARPET.width - 6}
                  y2={CARPET_BOTTOM + f * ROLL_THICKNESS}
                />
              ))}
            </g>
            <g data-j="wrap" className="stroke-paper/70" strokeWidth="2.5">
              {Array.from({ length: 11 }, (_, i) => (
                <line
                  key={i}
                  x1={CARPET.x + 2 + i * 24}
                  y1={CARPET_BOTTOM + ROLL_THICKNESS - 2}
                  x2={CARPET.x + 20 + i * 24}
                  y2={CARPET_BOTTOM + 2}
                />
              ))}
            </g>
            <g data-j="label">
              <rect
                x={CARPET_CENTER.x - 26}
                y={CARPET_BOTTOM + 6}
                width="52"
                height="32"
                rx="4"
                className="fill-paper stroke-canvas/30"
              />
              {Array.from({ length: 9 }, (_, i) => (
                <rect
                  key={i}
                  x={CARPET_CENTER.x - 20 + i * 3.6}
                  y={CARPET_BOTTOM + 11}
                  width={i % 2 ? 1.2 : 2.2}
                  height="14"
                  className="fill-canvas"
                />
              ))}
              <rect
                x={CARPET_CENTER.x - 20}
                y={CARPET_BOTTOM + 29}
                width="40"
                height="4"
                rx="2"
                className="fill-accent"
              />
            </g>
          </g>

          {/* Halı yüzeyi: paketlemede aşağı doğru sarılır */}
          <g data-j="carpet-body">
            {/* Desen görseli; dokundukça (kırpma büyüdükçe) alttan yukarı belirir */}
            <image
              href={carpetPattern}
              x={CARPET.x}
              y={CARPET.y}
              width={CARPET.width}
              height={CARPET.height}
              preserveAspectRatio="none"
              clipPath="url(#journey-weave-clip)"
            />

            {/* Tıraş öncesi: donuk ve kabarık yüzey */}
            <g data-j="raw">
              <rect
                data-j="raw-veil"
                x={CARPET.x}
                y={CARPET.y}
                width={CARPET.width}
                height={CARPET.height}
                className="fill-canvas/40"
              />
              <g className="stroke-paper/70" strokeWidth="1.6" strokeLinecap="round">
                {fuzz.map((f) => (
                  <line key={f.y} data-j="fuzz" x1={f.x} y1={f.y} x2={f.x + 1.5} y2={f.y - f.h} />
                ))}
              </g>
            </g>

            {/* İnce overlok (uzun kenarlar) */}
            <Overlock side="left" />
            <Overlock side="right" />

            {/* Kısa kenarların kilim bitim bandı (saçaklar buradan çıkar) */}
            <g data-j="end-band" className="fill-paper stroke-subtle/60" strokeWidth="0.5">
              <rect x={CARPET.x} y={CARPET.y - END_BAND} width={CARPET.width} height={END_BAND} />
              <rect x={CARPET.x} y={CARPET_BOTTOM} width={CARPET.width} height={END_BAND} />
            </g>

            {/* Üst saçaklar (halıyla birlikte sarılır) */}
            <g className="stroke-paper" strokeWidth="0.6" strokeLinecap="round" fill="none">
              {fringeXs.map((x, i) => (
                <g key={`t${x}`} data-j="fringe-top">
                  <path d={fringePath(x, CARPET.y - END_BAND, i, -1)} />
                  <ellipse
                    cx={x}
                    cy={CARPET.y - END_BAND - 0.6}
                    rx="1.1"
                    ry="0.8"
                    className="fill-paper"
                    stroke="none"
                  />
                </g>
              ))}
            </g>
          </g>

          {/* Alt saçaklar rulonun altında kalır (sarılınca gizlenir) */}
          <g
            data-j="fringes-bottom"
            className="stroke-paper"
            strokeWidth="0.6"
            strokeLinecap="round"
            fill="none"
          >
            {fringeXs.map((x, i) => (
              <g key={`b${x}`} data-j="fringe-bottom">
                <path d={fringePath(x, CARPET_BOTTOM + END_BAND, i, 1)} />
                <ellipse
                  cx={x}
                  cy={CARPET_BOTTOM + END_BAND + 0.6}
                  rx="1.1"
                  ry="0.8"
                  className="fill-paper"
                  stroke="none"
                />
              </g>
            ))}
          </g>

          {/* Tıraş bıçağı: yukarıdan aşağı geçer (halıyla birlikte ölçeklenir) */}
          <g data-j="blade">
            <rect
              x={CARPET.x - 16}
              y={CARPET.y - 10}
              width={CARPET.width + 32}
              height="20"
              rx="10"
              className="fill-accent/25"
            />
            <rect
              x={CARPET.x - 22}
              y={CARPET.y - 2.5}
              width={CARPET.width + 44}
              height="5"
              rx="2.5"
              className="fill-accent"
            />
          </g>

          {/* Overlok makinesi: baskı ayağı, iğne ve ipliği; kenar boyunca aşağı iner */}
          <g data-j="needle">
            <path
              d={`M${CARPET.x} ${CARPET.y - 10} C ${CARPET.x - 6} ${CARPET.y - 34}, ${CARPET.x - 26} ${CARPET.y - 40}, ${CARPET.x - 40} ${CARPET.y - 64}`}
              fill="none"
              className="stroke-paper/80"
              strokeWidth="0.7"
            />
            <rect
              x={CARPET.x - 7}
              y={CARPET.y + 1}
              width="14"
              height="4"
              rx="2"
              className="fill-subtle"
            />
            <g data-j="needle-bob">
              <rect
                x={CARPET.x - 4}
                y={CARPET.y - 22}
                width="8"
                height="10"
                rx="2"
                className="fill-muted"
              />
              <line
                x1={CARPET.x}
                y1={CARPET.y - 12}
                x2={CARPET.x}
                y2={CARPET.y + 2}
                className="stroke-ink"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <circle cx={CARPET.x} cy={CARPET.y - 1} r="0.8" className="fill-canvas" />
            </g>
          </g>
        </g>

        {/* ── Tezgâh (ön): tarak ve mekik ─────────────────────────── */}
        <g data-j="loom-front">
          <rect
            data-j="beater"
            x={CARPET.x - 12}
            y={CARPET_BOTTOM - 4}
            width={CARPET.width + 24}
            height="8"
            rx="4"
            className="fill-accent-strong"
          />
          <g data-j="shuttle">
            <rect x={CARPET.x - 22} y="-6" width="44" height="12" rx="6" className="fill-accent" />
            <rect
              x={CARPET.x - 10}
              y="-2.5"
              width="20"
              height="5"
              rx="2.5"
              className="fill-wool-red"
            />
          </g>
        </g>

        {/* ── Kalite kontrol ────────────────────────────────────── */}
        <g data-j="magnifier">
          <circle cx="0" cy="0" r="52" className="fill-ink/10 stroke-ink" strokeWidth="6" />
          <line
            x1="38"
            y1="38"
            x2="82"
            y2="82"
            className="stroke-ink"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
        <g data-j="stamp">
          <circle cx="820" cy="140" r="48" className="fill-accent" />
          <circle
            cx="820"
            cy="140"
            r="40"
            fill="none"
            className="stroke-on-accent/40"
            strokeWidth="2"
            strokeDasharray="4 5"
          />
          <path
            data-j="stamp-check"
            d="M798 141 L814 157 L844 124"
            fill="none"
            pathLength={1}
            strokeDasharray="1"
            className="stroke-on-accent"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  )
}
