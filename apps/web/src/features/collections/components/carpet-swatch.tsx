import { useId } from 'react'
import { cn } from '@/lib/cn'
import type { Collection, PatternKind } from '@/types/collection'

interface CarpetSwatchProps {
  pattern: PatternKind
  palette: Collection['palette']
  title?: string
  className?: string
}

const FRINGE = '#ece4d6'

/** Koleksiyon desenini temsil eden, tamamen kodla çizilmiş halı görseli. */
export function CarpetSwatch({ pattern, palette, title, className }: CarpetSwatchProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [base, main, accent] = palette

  return (
    <svg
      viewBox="0 0 200 300"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn('block h-auto w-full drop-shadow-xl', className)}
    >
      <defs>
        <pattern id={`band-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill={main} />
          <path d="M8 2 L14 8 L8 14 L2 8Z" fill={accent} />
          <path d="M8 6 L10 8 L8 10 L6 8Z" fill={base} />
        </pattern>
        <pattern id={`dots-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.4" fill={main} opacity="0.45" />
        </pattern>
        <pattern
          id={`diamond-${id}`}
          width="37"
          height="44"
          patternUnits="userSpaceOnUse"
          x="26"
          y="38"
        >
          <rect width="37" height="44" fill={base} />
          <path d="M18.5 3 L34 22 L18.5 41 L3 22Z" fill={main} />
          <path d="M18.5 11 L27.5 22 L18.5 33 L9.5 22Z" fill={accent} />
          <path d="M18.5 17.5 L22 22 L18.5 26.5 L15 22Z" fill={base} />
        </pattern>
        <pattern id={`stripe-${id}`} width="200" height="46" patternUnits="userSpaceOnUse" y="12">
          <rect width="200" height="46" fill={base} />
          <rect y="6" width="200" height="4" fill={main} />
          <rect y="14" width="200" height="1.5" fill={accent} opacity="0.8" />
          <rect y="28" width="200" height="10" fill={main} opacity="0.35" />
        </pattern>
        <pattern
          id={`grid-${id}`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
          x="18"
          y="30"
        >
          <rect width="30" height="30" fill={base} />
          <path d="M0 0 H30 M0 0 V30" stroke={main} strokeWidth="2" />
          <rect x="-3" y="-3" width="6" height="6" fill={accent} />
          <rect x="11" y="11" width="8" height="8" fill={main} opacity="0.5" />
        </pattern>
      </defs>

      {/* Saçaklar */}
      <g stroke={FRINGE} strokeWidth="1.2">
        {Array.from({ length: 33 }, (_, i) => {
          const x = 4 + i * 6
          return (
            <g key={x}>
              <line x1={x} y1="1" x2={x} y2="12" />
              <line x1={x} y1="288" x2={x} y2="299" />
            </g>
          )
        })}
      </g>

      {/* Gövde */}
      <rect y="12" width="200" height="276" fill={base} />

      {pattern === 'medallion' && (
        <>
          <rect x="10" y="22" width="180" height="256" fill={`url(#band-${id})`} />
          <rect x="24" y="36" width="152" height="228" fill={base} />
          <rect x="24" y="36" width="152" height="228" fill={`url(#dots-${id})`} />
          <rect
            x="28"
            y="40"
            width="144"
            height="220"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
          {/* Köşe motifleri */}
          <path d="M28 40 h44 L28 84Z" fill={main} />
          <path d="M172 40 h-44 L172 84Z" fill={main} />
          <path d="M28 260 h44 L28 216Z" fill={main} />
          <path d="M172 260 h-44 L172 216Z" fill={main} />
          {/* Madalyon */}
          <path d="M100 72 L152 150 L100 228 L48 150Z" fill={main} />
          <path d="M100 92 L138 150 L100 208 L62 150Z" fill={accent} />
          <path d="M100 112 L124 150 L100 188 L76 150Z" fill={base} />
          <path d="M100 132 L112 150 L100 168 L88 150Z" fill={main} />
          <circle cx="100" cy="60" r="5" fill={accent} />
          <circle cx="100" cy="240" r="5" fill={accent} />
        </>
      )}

      {pattern === 'geometric' && (
        <>
          <rect x="10" y="22" width="180" height="256" fill={`url(#band-${id})`} />
          <rect x="26" y="38" width="148" height="224" fill={`url(#diamond-${id})`} />
          <rect x="26" y="38" width="148" height="224" fill="none" stroke={base} strokeWidth="3" />
        </>
      )}

      {pattern === 'stripe' && (
        <>
          <rect y="12" width="200" height="276" fill={`url(#stripe-${id})`} />
          <rect
            x="8"
            y="20"
            width="184"
            height="260"
            fill="none"
            stroke={main}
            strokeWidth="1"
            opacity="0.6"
          />
        </>
      )}

      {pattern === 'grid' && (
        <>
          <rect x="18" y="30" width="164" height="240" fill={`url(#grid-${id})`} />
          <rect x="10" y="22" width="180" height="256" fill="none" stroke={main} strokeWidth="6" />
          <rect
            x="18"
            y="30"
            width="164"
            height="240"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  )
}
