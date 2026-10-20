import { useId } from 'react'
import { cn } from '@/lib/cn'
import { LOOM } from '../loom-config'

/**
 * Giriş animasyonundaki tezgâh: çözgü iplikleri, dokunarak ortaya çıkan madalyonlu halı ve mekik.
 * Hareket hero zaman çizelgesinde (GSAP) verilir; bu bileşen yalnızca çizimdir.
 * Animasyon hedefleri `data-loom` öznitelikleriyle seçilir.
 */
export function CarpetLoom({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { width: W, height: H, warps } = LOOM

  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className={cn('overflow-visible', className)}>
      <defs>
        <clipPath id={`woven-${id}`}>
          <rect data-loom="woven" x="0" y="0" width={W} height={H} />
        </clipPath>
        <pattern id={`band-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" className="fill-wool-navy" />
          <path d="M10 2 L18 10 L10 18 L2 10Z" className="fill-accent" />
          <path d="M10 7 L13 10 L10 13 L7 10Z" className="fill-wool-cream" />
        </pattern>
        <pattern id={`dots-${id}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="2" className="fill-accent" opacity="0.35" />
        </pattern>
        {/* Atkı dokusu: her 6 birimde bir ince koyu çizgi */}
        <pattern id={`weft-${id}`} width={W} height="6" patternUnits="userSpaceOnUse">
          <rect width={W} height="1.2" className="fill-canvas" opacity="0.22" />
        </pattern>
      </defs>

      {/* Dokunmuş halı (alttan yukarı açılan maske ile) */}
      <g clipPath={`url(#woven-${id})`}>
        <rect width={W} height={H} className="fill-wool-red" />
        <rect x="20" y="20" width={W - 40} height={H - 40} fill={`url(#band-${id})`} />
        <rect x="44" y="44" width={W - 88} height={H - 88} className="fill-wool-red" />
        <rect x="44" y="44" width={W - 88} height={H - 88} fill={`url(#dots-${id})`} />
        <rect
          x="54"
          y="54"
          width={W - 108}
          height={H - 108}
          fill="none"
          strokeWidth="3"
          className="stroke-wool-cream"
        />
        {/* Köşe motifleri */}
        <path d="M54 54 h84 L54 138Z" className="fill-wool-cream" />
        <path d={`M${W - 54} 54 h-84 L${W - 54} 138Z`} className="fill-wool-cream" />
        <path d={`M54 ${H - 54} h84 L54 ${H - 138}Z`} className="fill-wool-cream" />
        <path d={`M${W - 54} ${H - 54} h-84 L${W - 54} ${H - 138}Z`} className="fill-wool-cream" />
        {/* Madalyon */}
        <path d="M200 140 L330 300 L200 460 L70 300Z" className="fill-wool-navy" />
        <path d="M200 178 L298 300 L200 422 L102 300Z" className="fill-wool-cream" />
        <path d="M200 216 L266 300 L200 384 L134 300Z" className="fill-accent" />
        <path d="M200 254 L236 300 L200 346 L164 300Z" className="fill-wool-red" />
        <circle cx="200" cy="104" r="9" className="fill-accent" />
        <circle cx="200" cy={H - 104} r="9" className="fill-accent" />
        <rect width={W} height={H} fill={`url(#weft-${id})`} />
      </g>

      {/* Çözgü iplikleri */}
      <g data-loom="warp-group" className="stroke-muted" strokeWidth="1" opacity="0.55">
        {Array.from({ length: warps }, (_, i) => {
          const x = (i * W) / (warps - 1)
          return (
            <line
              key={x}
              data-loom="warp"
              x1={x}
              y1="0"
              x2={x}
              y2={H}
              pathLength={1}
              strokeDasharray="1"
            />
          )
        })}
      </g>

      {/* Mekik */}
      <g data-loom="shuttle" opacity="0">
        <circle r="18" className="fill-accent" opacity="0.18" />
        <rect x="-16" y="-4" width="32" height="8" rx="4" className="fill-accent" />
      </g>
    </svg>
  )
}
