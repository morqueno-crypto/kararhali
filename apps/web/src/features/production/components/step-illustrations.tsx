import type { CSSProperties } from 'react'

/*
 * Üretim adımlarının illüstrasyonları (240×240). Renkler token sınıflarıyla verilir.
 * Boşta hareketler CSS animasyonudur; reduced-motion açıksa globals.css onları durdurur.
 */

const frame = 'size-full overflow-visible'

/** 1 — Tasarım: kareli kâğıtta kendini çizen desen ve kalem */
export function Design() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <rect x="30" y="30" width="180" height="180" rx="12" className="fill-surface stroke-line" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} className="stroke-line" strokeWidth="1">
          <line x1={30 + (i + 1) * 20} y1="30" x2={30 + (i + 1) * 20} y2="210" />
          <line x1="30" y1={30 + (i + 1) * 20} x2="210" y2={30 + (i + 1) * 20} />
        </g>
      ))}
      <path
        d="M120 60 L180 120 L120 180 L60 120Z M120 90 L150 120 L120 150 L90 120Z"
        pathLength={1}
        strokeDasharray="1"
        fill="none"
        strokeWidth="4"
        strokeLinejoin="round"
        className="animate-draw stroke-accent"
      />
      <g className="animate-float" style={{ transformOrigin: '180px 70px' }}>
        <path d="M168 40 l26 26 -54 54 -32 6 6 -32Z" className="fill-wool-cream" />
        <path d="M114 114 l-6 32 32 -6Z" className="fill-accent" />
      </g>
    </svg>
  )
}

/** 2 — İplik: dönen makara ve akan iplik */
export function Yarn() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <path
        d="M120 120 C 170 150, 190 200, 230 210"
        fill="none"
        strokeWidth="3"
        className="stroke-accent"
      />
      <g className="animate-spin-slow" style={{ transformOrigin: '120px 120px' }}>
        <circle cx="120" cy="120" r="78" className="fill-wool-red" />
        {Array.from({ length: 10 }, (_, i) => (
          <circle
            key={i}
            cx="120"
            cy="120"
            r={74 - i * 6}
            fill="none"
            strokeWidth="2"
            className="stroke-canvas"
            opacity="0.25"
          />
        ))}
        <rect x="114" y="38" width="12" height="164" rx="6" className="fill-wool-cream" />
        <circle cx="120" cy="120" r="16" className="fill-canvas" />
      </g>
    </svg>
  )
}

/** 3 — Dokuma: çözgü, gidip gelen mekik ve dokunmuş sıralar */
export function Weaving() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <rect x="40" y="130" width="160" height="80" className="fill-wool-navy" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x="40"
          y={130 + i * 14}
          width="160"
          height="6"
          className={i % 2 === 0 ? 'fill-accent' : 'fill-wool-cream'}
          opacity="0.85"
        />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line
          key={i}
          x1={40 + i * 16}
          y1="30"
          x2={40 + i * 16}
          y2="210"
          strokeWidth="1.5"
          className="stroke-muted"
          opacity="0.6"
        />
      ))}
      <rect x="28" y="24" width="184" height="10" rx="5" className="fill-raised stroke-line" />
      <g className="animate-shuttle" style={{ '--shuttle-distance': '140px' } as CSSProperties}>
        <rect x="34" y="112" width="40" height="12" rx="6" className="fill-accent" />
      </g>
    </svg>
  )
}

/** 4 — Bitiş: halı yüzeyini tıraşlayan makas */
export function Finishing() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <rect x="30" y="120" width="180" height="90" rx="6" className="fill-wool-red" />
      <rect
        x="44"
        y="134"
        width="152"
        height="62"
        fill="none"
        strokeWidth="3"
        className="stroke-wool-cream"
      />
      {Array.from({ length: 16 }, (_, i) => (
        <line
          key={i}
          x1={36 + i * 11}
          y1="120"
          x2={36 + i * 11}
          y2="110"
          strokeWidth="2"
          className="stroke-wool-cream"
        />
      ))}
      <g
        className="animate-sweep"
        style={{ '--sweep-x': '90px', '--sweep-y': '0px' } as CSSProperties}
      >
        <g transform="translate(40 40)">
          <circle cx="16" cy="56" r="14" fill="none" strokeWidth="5" className="stroke-ink" />
          <circle cx="50" cy="56" r="14" fill="none" strokeWidth="5" className="stroke-ink" />
          <g className="animate-snip" style={{ transformOrigin: '33px 40px' }}>
            <path
              d="M26 46 L70 4"
              strokeWidth="6"
              strokeLinecap="round"
              className="stroke-accent"
            />
          </g>
          <path d="M40 46 L-4 4" strokeWidth="6" strokeLinecap="round" className="stroke-accent" />
        </g>
      </g>
    </svg>
  )
}

/** 5 — Kalite kontrol: halı üzerinde gezinen büyüteç ve onay işareti */
export function Quality() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <rect x="30" y="40" width="180" height="170" rx="8" className="fill-wool-navy" />
      <path d="M120 70 L180 125 L120 180 L60 125Z" className="fill-wool-cream" opacity="0.9" />
      <path d="M120 98 L150 125 L120 152 L90 125Z" className="fill-accent" />
      <g
        className="animate-sweep"
        style={{ '--sweep-x': '70px', '--sweep-y': '50px' } as CSSProperties}
      >
        <circle cx="80" cy="90" r="30" strokeWidth="6" className="fill-ink/10 stroke-ink" />
        <path d="M102 112 L130 140" strokeWidth="10" strokeLinecap="round" className="stroke-ink" />
      </g>
      <circle cx="190" cy="50" r="22" className="fill-accent" />
      <path
        d="M180 50 l7 7 13 -14"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-on-accent"
      />
    </svg>
  )
}

/** 6 — Sevkiyat: sarılmış halı rulosu yola çıkar */
export function Shipping() {
  return (
    <svg viewBox="0 0 240 240" className={frame} aria-hidden="true">
      <line
        x1="10"
        y1="200"
        x2="230"
        y2="200"
        strokeWidth="2"
        strokeDasharray="10 8"
        className="stroke-line"
      />
      <g className="animate-float" style={{ transformOrigin: '120px 150px' }}>
        <rect x="40" y="120" width="150" height="56" rx="28" className="fill-wool-red" />
        <ellipse cx="190" cy="148" rx="16" ry="28" className="fill-wool-cream" />
        <ellipse
          cx="190"
          cy="148"
          rx="9"
          ry="17"
          fill="none"
          strokeWidth="3"
          className="stroke-wool-red"
        />
        <ellipse cx="190" cy="148" rx="3" ry="6" className="fill-wool-red" />
        <rect x="80" y="116" width="10" height="64" className="fill-accent" />
        <rect x="140" y="116" width="10" height="64" className="fill-accent" />
      </g>
      <path
        d="M40 70 h50 M30 88 h40 M48 52 h30"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-subtle"
      />
    </svg>
  )
}
