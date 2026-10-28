import { useRef } from 'react'
import { useInView } from '@/lib/motion/use-in-view'
import { cn } from '@/lib/cn'

interface EmphasisProps {
  /** Tam metin (i18n'den). */
  text: string
  /** Metin içinde vurgulanacak parça (i18n'den). Bulunamazsa metin olduğu gibi gösterilir. */
  accent?: string
  className?: string
}

/**
 * Başlıkta vurgulu kelime: accent rengi + altında kendini çizen el çizimi "iplik" çizgisi.
 * Metin ve vurgu ayrı i18n anahtarlarından gelir; bileşende sabit metin yoktur.
 */
export function Emphasis({ text, accent, className }: EmphasisProps) {
  const index = accent ? text.indexOf(accent) : -1
  if (!accent || index === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <AccentWord className={className}>{accent}</AccentWord>
      {text.slice(index + accent.length)}
    </>
  )
}

export function AccentWord({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const drawn = useInView(ref, { threshold: 0.6 })

  return (
    <span
      ref={ref}
      data-drawn={drawn ? '' : undefined}
      className={cn('relative inline-block whitespace-nowrap text-accent', className)}
    >
      {/* Altından kiremide degrade yazı; alttaki iplik çizgisi currentColor (altın) kullanır */}
      <span className="bg-linear-to-r from-accent via-accent-strong to-accent-2 bg-clip-text text-transparent">
        {children}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.22em] w-full overflow-visible"
      >
        <path
          className="thread-line"
          pathLength={1}
          d="M2 13 C 40 4, 70 18, 110 10 S 180 3, 220 11 S 280 16, 298 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
