import { journeyChapterKeys, type JourneyChapterKey, type PublicContent } from '@karar-hali/shared'
import {
  Cpu,
  Layers,
  Package,
  Scissors,
  ScanSearch,
  Sparkle,
  Spline,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { useLenis } from '@/lib/motion/use-lenis'
import { useReducedMotion } from '@/lib/motion/use-media-query'
import { buildJourneyTimeline, CHAPTER_COUNT, chapterRestPoints } from '../build-journey-timeline'
import { JourneyScene } from './journey-scene'

type Chapters = PublicContent['home.journey']['chapters']

const chapterIcons: Record<JourneyChapterKey, LucideIcon> = {
  creel: Spline,
  warp: Cpu,
  weaving: Layers,
  shearing: Sparkle,
  binding: Scissors,
  quality: ScanSearch,
  packing: Package,
  shipping: Truck,
}

/**
 * Üretim yolculuğu: ekrana sabitlenen tek bir sahne, kaydırdıkça 8 bölüm boyunca oynar.
 * Her bölümün animasyonu kendi kaydırma aralığının başında biter; kalan kısımda sahne durur ve metin okunur.
 * (Snap kullanılmaz: Lenis'in yumuşak kaydırmasıyla çakışıp bölüm atlatıyor.)
 * Reduced-motion açıksa sahne yerine bölümler dikey bir liste olarak gösterilir.
 */
export function JourneyStory({ chapters }: { chapters: Chapters }) {
  const reduced = useReducedMotion()
  return reduced ? <StackedJourney chapters={chapters} /> : <PinnedJourney chapters={chapters} />
}

function PinnedJourney({ chapters }: { chapters: Chapters }) {
  const { t } = useI18n()
  const lenis = useLenis()
  const scope = useRef<HTMLDivElement>(null)
  const trigger = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const q = gsap.utils.selector(root)
      const tl = buildJourneyTimeline(root)

      // Bölüm metinleri (push): eski başlığın kelimeleri maskenin içinde yukarı itilir, yenisininkiler
      // alttan yükselir; etiket, metin ve bilgi kayarak değişir. Numara ve ikon sayaç gibi döner.
      const panels = q('[data-journey="panel"]')
      const words = (panel: Element) => panel.querySelectorAll('[data-journey="word"]')
      const fades = (panel: Element) => panel.querySelectorAll('[data-journey="fade"]')
      // Kelime boyu kadar aşağı/yukarı (yüzde değil piksel: gizli panellerde yPercent tutarsız okunuyor)
      const below = (_: number, el: Element) => (el as HTMLElement).offsetHeight * 1.1
      const above = (_: number, el: Element) => -(el as HTMLElement).offsetHeight * 1.1
      panels.slice(1).forEach((panel) => {
        gsap.set(panel, { autoAlpha: 0 })
        gsap.set(words(panel), { y: below })
        gsap.set(fades(panel), { opacity: 0, y: 24 })
      })
      panels.forEach((panel, i) => {
        const previous = panels[i - 1]
        if (!previous) return
        const out = i - 0.12
        tl.to(words(previous), { y: above, duration: 0.12, stagger: 0.012, ease: 'power3.in' }, out)
          .to(fades(previous), { opacity: 0, y: -24, duration: 0.1, ease: 'power2.in' }, out)
          .set(previous, { autoAlpha: 0 }, i + 0.01)
          .set(panel, { autoAlpha: 1 }, i)
          .fromTo(
            words(panel),
            { y: below },
            { y: 0, duration: 0.2, stagger: 0.018, ease: 'power3.out' },
            i,
          )
          .fromTo(
            fades(panel),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.18, stagger: 0.03, ease: 'power2.out' },
            i + 0.05,
          )
          .to(
            q('[data-journey="counter"]'),
            { yPercent: (-100 * i) / CHAPTER_COUNT, duration: 0.24, ease: 'power3.inOut' },
            i - 0.1,
          )
      })
      tl.fromTo(
        q('[data-journey="rail-fill"]'),
        { scaleX: 0 },
        { scaleX: 1, duration: CHAPTER_COUNT, ease: 'none' },
        0,
      )

      const header = document.querySelector('header')
      trigger.current = ScrollTrigger.create({
        trigger: root,
        animation: tl,
        start: () => `top ${header?.offsetHeight ?? 0}px`,
        end: () => `+=${window.innerHeight * CHAPTER_COUNT * 0.9}`,
        pin: true,
        scrub: 0.8,
        // Kelime kaydırmaları piksel olduğu için boyut değişince yeniden hesaplanır
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const index = Math.min(CHAPTER_COUNT - 1, Math.floor(self.progress * CHAPTER_COUNT))
          setActive((current) => (current === index ? current : index))
        },
      })
    },
    { scope, dependencies: [] },
  )

  /** İlerleme çubuğundan bir bölüme git: o bölümün tamamlandığı kaydırma konumuna */
  function goTo(index: number) {
    const st = trigger.current
    if (!st) return
    const target = st.start + (st.end - st.start) * (chapterRestPoints[index] ?? 0)
    if (lenis) lenis.scrollTo(target, { duration: 1.4 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const current = chapters[journeyChapterKeys[active] ?? 'creel']

  return (
    <div
      ref={scope}
      className="relative isolate flex h-[calc(100svh-4.5rem)] min-h-[34rem] flex-col overflow-hidden bg-canvas"
    >
      {/* Arka planda ılık ışık */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-[10%] -z-10 size-[36rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[5%] -z-10 size-[28rem] rounded-full bg-accent-2/10 blur-3xl"
      />

      <Container className="flex min-h-0 flex-1 flex-col pt-6 pb-5 sm:pt-8 lg:pb-8">
        {/* İlerleme çubuğu: bölüm adları tıklanabilir */}
        <nav aria-label={t.home.journey.chapters} className="shrink-0">
          <div className="relative h-0.5 overflow-hidden rounded-full bg-line">
            <div
              data-journey="rail-fill"
              className="absolute inset-0 origin-left scale-x-0 rounded-full bg-linear-to-r from-accent to-accent-2"
            />
          </div>
          <ol className="mt-3 grid grid-cols-8 gap-1">
            {journeyChapterKeys.map((key, index) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={t.home.journey.goTo(chapters[key].label)}
                  aria-current={index === active ? 'step' : undefined}
                  className={cn(
                    'group flex w-full flex-col items-start gap-1 text-left transition-colors',
                    index === active ? 'text-ink' : index < active ? 'text-muted' : 'text-subtle',
                  )}
                >
                  <span className="font-display text-xs font-semibold tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="hidden truncate text-xs font-medium group-hover:text-ink md:block">
                    {chapters[key].label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 lg:mt-6 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:gap-10">
          {/* Sahne */}
          <div className="relative min-h-0 lg:order-2 lg:col-span-7 lg:h-full">
            <JourneyScene className="absolute inset-0 size-full" />
          </div>

          <div className="lg:order-1 lg:col-span-5">
            {/* Numara ve ikon: sayaç gibi dikey şeritte döner (push) */}
            <div className="flex items-center gap-4" aria-hidden="true">
              <span className="block h-[1em] overflow-hidden font-display text-6xl leading-none font-semibold sm:text-7xl lg:text-8xl">
                <span data-journey="counter" className="flex flex-col will-change-transform">
                  {journeyChapterKeys.map((key, index) => (
                    <span
                      key={key}
                      className="h-[1em] bg-linear-to-br from-accent to-accent-2 bg-clip-text text-transparent tabular-nums"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  ))}
                </span>
              </span>
              <span className="inline-flex size-11 items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-accent">
                <span
                  data-journey="counter"
                  className="flex flex-col self-start will-change-transform"
                >
                  {journeyChapterKeys.map((key) => {
                    const Icon = chapterIcons[key]
                    return (
                      <span key={key} className="flex size-11 shrink-0 items-center justify-center">
                        <Icon className="size-5" />
                      </span>
                    )
                  })}
                </span>
              </span>
            </div>

            {/* Bölüm metinleri: hepsi aynı hücrede üst üste; kap en uzun metin kadar yer tutar */}
            <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              {journeyChapterKeys.map((key, index) => {
                const chapter = chapters[key]
                return (
                  <article key={key} data-journey="panel" aria-hidden={index !== active}>
                    <p
                      data-journey="fade"
                      className="mt-4 text-xs font-medium tracking-[0.3em] text-accent uppercase"
                    >
                      {chapter.label}
                    </p>
                    <h3 className="mt-2 text-3xl leading-tight font-semibold text-ink sm:text-4xl lg:text-5xl">
                      {chapter.title.split(' ').map((word, wordIndex) => (
                        <span key={`${word}-${wordIndex}`}>
                          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                            <span
                              data-journey="word"
                              className="inline-block will-change-transform"
                            >
                              {word}
                            </span>
                          </span>{' '}
                        </span>
                      ))}
                    </h3>
                    <p
                      data-journey="fade"
                      className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base lg:mt-5 lg:text-lg"
                    >
                      {chapter.text}
                    </p>
                    <p
                      data-journey="fade"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent lg:mt-6 lg:text-sm"
                    >
                      <Sparkle className="size-3.5" aria-hidden="true" />
                      {chapter.fact}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* Ekran okuyucular için etkin bölüm */}
      <p className="sr-only" aria-live="polite">
        {`${t.home.journey.chapter(active + 1, CHAPTER_COUNT)}: ${current.title}. ${current.text}`}
      </p>
    </div>
  )
}

/** Reduced-motion: sahne yok; bölümler numaralı, ikonlu bir zaman çizelgesi olarak listelenir. */
function StackedJourney({ chapters }: { chapters: Chapters }) {
  return (
    <Container className="py-16 sm:py-24">
      <ol className="relative grid gap-6 before:absolute before:top-0 before:bottom-0 before:left-6 before:w-px before:bg-line sm:gap-8">
        {journeyChapterKeys.map((key, index) => {
          const chapter = chapters[key]
          const Icon = chapterIcons[key]
          return (
            <Reveal as="li" key={key} className="relative grid grid-cols-[3rem_1fr] gap-5">
              <span className="relative z-10 inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <p className="text-xs font-medium tracking-[0.3em] text-accent uppercase">
                  {String(index + 1).padStart(2, '0')} · {chapter.label}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
                  {chapter.title}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{chapter.text}</p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  <Sparkle className="size-3.5" aria-hidden="true" />
                  {chapter.fact}
                </p>
              </div>
            </Reveal>
          )
        })}
      </ol>
    </Container>
  )
}
