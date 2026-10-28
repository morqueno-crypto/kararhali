import type { PublicContent } from '@karar-hali/shared'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { AccentWord } from '@/components/ui/emphasis'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useReducedMotion } from '@/lib/motion/use-media-query'
import { threadPath, THREAD_VIEWBOX, useThreadPluck } from '../use-thread-pluck'

type Journey = PublicContent['home.journey']

const threadColors = [
  'stroke-wool-red',
  'stroke-accent',
  'stroke-wool-cream',
  'stroke-accent-2',
  'stroke-wool-navy',
]
// Ekranı boydan boya geçen çözgü iplikleri (sabit, sözde-rastgele dalga; imlece tepki verir)
const threads = Array.from({ length: 34 }, (_, i) => {
  const x = 12 + i * 29.5
  const sway = ((i * 37) % 30) - 15
  return { x, sway, color: threadColors[i % threadColors.length]!, width: 1 + ((i * 3) % 3) }
})

/**
 * Ana sayfa girişi: yukarıdan aşağı inen çözgü iplikleri arasında başlık. İplikler imlece tepki verir
 * (yaklaşınca aralanır, uzaklaşınca titreyerek yerine döner).
 * Aşağı kaydırınca içerik yukarı kayarak çekilir ve hikâye (JourneyStory) başlar.
 */
export function JourneyIntro({
  journey,
  primaryCta,
  skipTo,
}: {
  journey: Journey
  primaryCta: string
  /** Hikâyeyi atlayınca gidilecek bölümün id'si */
  skipTo: string
}) {
  const { t, path } = useI18n()
  const reduced = useReducedMotion()
  const scope = useRef<HTMLElement>(null)
  const threadsSvg = useRef<SVGSVGElement>(null)
  useThreadPluck(scope, threadsSvg, threads, !reduced)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(scope)
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          q('[data-intro="thread"]'),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.2, stagger: { each: 0.03, from: 'center' } },
        )
        .from(q('[data-intro="word"]'), { yPercent: 115, duration: 1.1, stagger: 0.08 }, 0.3)
        .from(q('[data-intro="fade"]'), { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0.7)

      // Kaydırınca içerik çekilir, iplikler aşağı doğru gerilir (hikâyeye bağlanır)
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
        .to(q('[data-intro="content"]'), { yPercent: -35, opacity: 0, ease: 'none' }, 0)
        .to(q('[data-intro="threads"]'), { scaleY: 1.25, opacity: 0.35, ease: 'none' }, 0)
    },
    { scope, dependencies: [reduced] },
  )

  const accentWords = new Set(journey.titleAccent.split(' ').filter(Boolean))

  return (
    <section
      ref={scope}
      className="relative isolate flex h-[calc(100svh-4.5rem)] min-h-[34rem] items-center overflow-hidden bg-canvas"
    >
      <svg
        ref={threadsSvg}
        data-intro="threads"
        viewBox={`0 0 ${THREAD_VIEWBOX.width} ${THREAD_VIEWBOX.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full origin-top opacity-90"
      >
        {threads.map((thread) => (
          <path
            key={thread.x}
            data-intro="thread"
            d={threadPath(thread)}
            fill="none"
            pathLength={1}
            strokeDasharray="1"
            strokeWidth={thread.width}
            vectorEffect="non-scaling-stroke"
            className={cn(thread.color, 'opacity-70')}
          />
        ))}
      </svg>
      {/* İpliklerin üstünde okunabilirlik için ortada koyulaşan zemin */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-radial from-canvas via-canvas/70 to-transparent"
      />

      <Container className="relative">
        <div data-intro="content" className="mx-auto max-w-4xl text-center">
          <p
            data-intro="fade"
            className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-accent uppercase"
          >
            <span
              className="h-px w-8 bg-linear-to-r from-transparent to-accent"
              aria-hidden="true"
            />
            {journey.eyebrow}
            <span
              className="h-px w-8 bg-linear-to-l from-transparent to-accent-2"
              aria-hidden="true"
            />
          </p>
          <h1 className="mt-6 text-[clamp(3rem,10vw,8.5rem)] leading-[0.92] font-semibold text-ink">
            {journey.title.split(' ').map((word, index) => (
              <span key={`${word}-${index}`}>
                <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span data-intro="word" className="inline-block will-change-transform">
                    {accentWords.has(word) ? <AccentWord>{word}</AccentWord> : word}
                  </span>
                </span>{' '}
              </span>
            ))}
          </h1>
          <p
            data-intro="fade"
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {journey.text}
          </p>
          <div data-intro="fade" className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to={path('collections')}>
              {primaryCta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <a
              href={`#${skipTo}`}
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-ink/5"
            >
              {t.home.journey.skip}
            </a>
          </div>
        </div>
      </Container>

      {/* Kaydırma ipucu */}
      <div
        data-intro="fade"
        className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-xs font-medium tracking-[0.2em] text-subtle uppercase"
      >
        {journey.scrollCue}
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-scroll-cue" />
        </span>
        <ArrowDown className="size-4 text-accent motion-safe:animate-float" aria-hidden="true" />
      </div>
    </section>
  )
}
