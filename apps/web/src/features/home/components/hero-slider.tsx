import type { PublicContent } from '@karar-hali/shared'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { AccentWord } from '@/components/ui/emphasis'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useReducedMotion } from '@/lib/motion/use-media-query'

type Slide = PublicContent['home.slides']['items'][number]

/** Bir slaytın ekranda kalma süresi (ms). İlerleme çubuğunun CSS animasyonu da bu süreyi kullanır. */
export const SLIDE_DURATION = 7000

interface HeroSliderProps {
  hero: PublicContent['home.hero']
  slides: Slide[]
}

/**
 * Ana sayfa giriş slaytı: tam ekran görseller, perde gibi açılan geçişler, yavaş yakınlaşma (Ken Burns),
 * kelime kelime yükselen başlıklar ve ilerleme çubuklu otomatik geçiş.
 *
 * - Otomatik geçiş; klavye odağı içerideyken, sekme gizliyken ve kullanıcı durdurunca bekler.
 * - Ok tuşları, kaydırma (swipe), önceki/sonraki ve slayt düğmeleriyle gezilir.
 * - Reduced-motion açıksa otomatik geçiş ve animasyon yoktur; slaytlar düğmelerle anında değişir.
 */
export function HeroSlider({ hero, slides }: HeroSliderProps) {
  const { t, path } = useI18n()
  const labels = t.home.slider
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const scope = useRef<HTMLElement>(null)
  const previous = useRef<{ index: number; direction: 1 | -1 } | null>(null)
  const pointerStart = useRef<number | null>(null)

  const count = slides.length
  const autoplay = !reduced && !userPaused && !interacting && !hidden && count > 1

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  function go(next: number, direction: 1 | -1) {
    const target = (next + count) % count
    if (target === index) return
    previous.current = { index, direction }
    setIndex(target)
  }
  const goNext = () => go(index + 1, 1)
  const goPrevious = () => go(index - 1, -1)

  // Açılış: ilk slayt yakınlaşarak gelir, başlık yükselir.
  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(scope)
      const first = q('[data-slide-item]')[0]
      if (!first) return
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          first.querySelector('[data-slide="zoom"]'),
          { scale: 1.25 },
          { scale: 1, duration: 2.2 },
        )
        .from(
          first.querySelectorAll('[data-slide="word"]'),
          { yPercent: 115, duration: 1.1, stagger: 0.07 },
          0.2,
        )
        .from(
          first.querySelectorAll('[data-slide="fade"]'),
          { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08 },
          0.5,
        )
        .from(q('[data-slider="chrome"]'), { opacity: 0, y: 20, duration: 0.8 }, 0.8)
    },
    { scope, dependencies: [] },
  )

  // Slayt değişimi: yeni görsel yönüne göre perde gibi açılır, eskisi ters yöne kayar.
  useGSAP(
    () => {
      const from = previous.current
      if (reduced || !from) return
      const q = gsap.utils.selector(scope)
      const items = q('[data-slide-item]')
      const incoming = items[index]
      const outgoing = items[from.index]
      if (!incoming || !outgoing) return
      const dir = from.direction

      gsap.killTweensOf(items)
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(outgoing, { clearProps: 'visibility,zIndex' })
          gsap.set(outgoing.querySelector('[data-slide="media"]'), { clearProps: 'all' })
        },
      })
      tl.set(outgoing, { visibility: 'visible', zIndex: 1 })
        .set(incoming, { zIndex: 2 })
        // Giden slayt: metni hızla çıkar, görseli ters yöne kaydır
        .to(
          outgoing.querySelectorAll('[data-slide="text"]'),
          { autoAlpha: 0, y: -30, duration: 0.45, ease: 'power2.in' },
          0,
        )
        .to(
          outgoing.querySelector('[data-slide="media"]'),
          { xPercent: -14 * dir, duration: 1.3 },
          0,
        )
        // Gelen slayt: perde açılışı + yakınlaşmadan uzaklaşma
        .fromTo(
          incoming.querySelector('[data-slide="media"]'),
          { clipPath: dir === 1 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 },
          0,
        )
        .fromTo(
          incoming.querySelector('[data-slide="zoom"]'),
          { scale: 1.35 },
          { scale: 1, duration: 1.9, ease: 'expo.out' },
          0,
        )
        .fromTo(
          incoming.querySelectorAll('[data-slide="text"]'),
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 1, y: 0, duration: 0 },
          0,
        )
        .fromTo(
          incoming.querySelectorAll('[data-slide="word"]'),
          { yPercent: 115 },
          { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' },
          0.55,
        )
        .fromTo(
          incoming.querySelectorAll('[data-slide="fade"]'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' },
          0.75,
        )
    },
    { scope, dependencies: [index, reduced] },
  )

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrevious()
    }
  }

  function onPointerDown(event: PointerEvent) {
    pointerStart.current = event.clientX
  }

  function onPointerUp(event: PointerEvent) {
    if (pointerStart.current === null) return
    const delta = event.clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(delta) > 60) {
      if (delta < 0) goNext()
      else goPrevious()
    }
  }

  const upNext = slides[(index + 1) % count]

  return (
    <section
      ref={scope}
      aria-roledescription="carousel"
      aria-label={labels.label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      // Klavyeyle içeride gezinirken beklenir (fareyle tıklama odağı otomatik geçişi durdurmaz)
      onFocus={(event) => event.target.matches(':focus-visible') && setInteracting(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false)
      }}
      className="relative isolate h-[calc(100svh-4.5rem)] min-h-[36rem] touch-pan-y overflow-hidden bg-canvas select-none"
    >
      <div aria-live={autoplay ? 'off' : 'polite'} className="absolute inset-0">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index
          return (
            <div
              key={`${slide.image}-${slideIndex}`}
              data-slide-item
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slide(slideIndex + 1, count)}
              aria-hidden={!active}
              inert={!active}
              className={cn('absolute inset-0', active ? 'visible z-[2]' : 'invisible z-0')}
            >
              <div data-slide="media" className="absolute inset-0 overflow-hidden">
                <div data-slide="zoom" className="absolute inset-0 will-change-transform">
                  {/* Ken Burns tüm slaytlarda sürekli döner; geçişte giden slayt aniden sıçramaz */}
                  <div
                    className={cn(
                      'absolute inset-0 motion-safe:animate-ken-burns',
                      slideIndex % 2 === 0 ? 'origin-[70%_40%]' : 'origin-[30%_60%]',
                    )}
                  >
                    <RemoteImage
                      src={slide.image}
                      alt={slide.imageAlt}
                      loading={slideIndex === 0 ? 'eager' : 'lazy'}
                      fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                      className="size-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
                {/* Okunabilirlik için alt ve sol gölge; görselin renkleri üstte canlı kalır */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/35 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-r from-canvas/80 via-canvas/20 to-transparent"
                />
              </div>

              <Container className="relative flex h-full flex-col justify-end pb-40 sm:pb-44">
                <div data-slide="text" className="max-w-4xl">
                  <p
                    data-slide="fade"
                    className="inline-flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-accent uppercase"
                  >
                    <span
                      className="h-px w-8 bg-linear-to-r from-accent to-accent-2"
                      aria-hidden="true"
                    />
                    {slide.eyebrow}
                  </p>
                  <h2 className="mt-5 text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] font-semibold text-ink">
                    <SlideTitle title={slide.title} accent={slide.titleAccent} />
                  </h2>
                  <p
                    data-slide="fade"
                    className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg"
                  >
                    {slide.text}
                  </p>
                  <div data-slide="fade" className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink to={path('collections')}>
                      {hero.primaryCta} <ArrowRight className="size-4" aria-hidden="true" />
                    </ButtonLink>
                    <ButtonLink
                      to={path('about')}
                      variant="secondary"
                      className="border-ink/25 bg-canvas/30 backdrop-blur"
                    >
                      {hero.secondaryCta}
                    </ButtonLink>
                  </div>
                </div>
              </Container>
            </div>
          )
        })}
      </div>

      {count > 1 && (
        <div data-slider="chrome" className="absolute inset-x-0 bottom-0 z-10">
          <Container className="flex items-end justify-between gap-6 pb-8 sm:pb-10">
            <div className="flex min-w-0 flex-1 items-end gap-5">
              <p className="font-display text-ink tabular-nums" aria-hidden="true">
                <span
                  key={index}
                  className="inline-block text-4xl font-semibold motion-safe:animate-count-in"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="ml-1 text-sm text-subtle">/ {String(count).padStart(2, '0')}</span>
              </p>
              <ol className="mb-3 flex max-w-md flex-1 gap-2">
                {slides.map((slide, slideIndex) => (
                  <li key={`${slide.image}-${slideIndex}`} className="flex-1">
                    <button
                      type="button"
                      onClick={() => go(slideIndex, slideIndex > index ? 1 : -1)}
                      aria-label={labels.goTo(slideIndex + 1)}
                      aria-current={slideIndex === index ? 'true' : undefined}
                      className="group block w-full py-2"
                    >
                      <span className="relative block h-0.5 overflow-hidden rounded-full bg-ink/20 transition-colors group-hover:bg-ink/40">
                        <span
                          key={slideIndex === index ? `active-${index}` : 'idle'}
                          className={cn(
                            'absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-accent to-accent-2',
                            slideIndex < index && 'w-full',
                            slideIndex > index && 'w-0',
                            slideIndex === index && (reduced ? 'w-full' : 'animate-slide-progress'),
                          )}
                          style={
                            slideIndex === index && !reduced
                              ? {
                                  animationDuration: `${SLIDE_DURATION}ms`,
                                  animationPlayState: autoplay ? 'running' : 'paused',
                                }
                              : undefined
                          }
                          onAnimationEnd={slideIndex === index ? goNext : undefined}
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            {upNext && (
              <button
                type="button"
                onClick={goNext}
                className="group hidden items-center gap-3 rounded-2xl border border-ink/15 bg-canvas/40 p-2 pr-4 text-left backdrop-blur-md transition-colors hover:border-accent/60 lg:flex"
              >
                <span className="relative size-14 overflow-hidden rounded-xl">
                  <RemoteImage
                    key={upNext.image}
                    src={upNext.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </span>
                <span className="max-w-44">
                  <span className="block text-[10px] font-medium tracking-[0.25em] text-accent uppercase">
                    {labels.upNext}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-medium text-ink">
                    {upNext.title}
                  </span>
                </span>
              </button>
            )}

            <div className="flex shrink-0 items-center gap-2">
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setUserPaused((value) => !value)}
                  aria-label={userPaused ? labels.play : labels.pause}
                  className={sliderButton}
                >
                  {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                </button>
              )}
              <button
                type="button"
                onClick={goPrevious}
                aria-label={labels.previous}
                className={sliderButton}
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={labels.next}
                className={sliderButton}
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </Container>
        </div>
      )}
    </section>
  )
}

const sliderButton =
  'inline-flex size-12 items-center justify-center rounded-full border border-ink/20 bg-canvas/30 text-ink backdrop-blur-md transition-[background-color,border-color,color,transform] duration-300 hover:border-accent hover:bg-accent hover:text-on-accent active:scale-95'

/** Başlığı kelime kelime maskeli satırlara böler; vurgulu kelimeler altın + iplik çizgisiyle gelir. */
function SlideTitle({ title, accent }: { title: string; accent: string }) {
  const accentWords = new Set(accent.split(' ').filter(Boolean))
  return title.split(' ').map((word, index) => (
    <span key={`${word}-${index}`}>
      <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
        <span data-slide="word" className="inline-block will-change-transform">
          {accentWords.has(word) ? <AccentWord>{word}</AccentWord> : word}
        </span>
      </span>{' '}
    </span>
  ))
}
