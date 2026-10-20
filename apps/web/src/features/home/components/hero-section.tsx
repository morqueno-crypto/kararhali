import type { PublicContent } from '@karar-hali/shared'
import { ArrowRight, FastForward } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { AccentWord } from '@/components/ui/emphasis'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { EASE } from '@/lib/motion/constants'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { useLenis } from '@/lib/motion/use-lenis'
import { useReducedMotion } from '@/lib/motion/use-media-query'
import { hasSeenIntro, markIntroSeen } from '../intro-storage'
import { LOOM } from '../loom-config'
import { CarpetLoom } from './carpet-loom'

type IntroMode = 'full' | 'short' | 'none'

/**
 * Hero: ilk ziyarette "dokuma" girişi (çözgü → atkı → desen → fotoğraf), sonraki ziyaretlerde kısa giriş.
 * Aşağı kaydırınca sahne sabitlenir; fotoğraf büyür, başlık uzaklaşır, halı alttan yukarı "sarılarak" kapanır.
 * Reduced-motion açıksa hiçbir animasyon kurulmaz, içerik baştan görünür.
 */
export function HeroSection({ content: hero }: { content: PublicContent['home.hero'] }) {
  const { t, path } = useI18n()
  const reduced = useReducedMotion()
  const lenis = useLenis()
  const [mode] = useState<IntroMode>(() => (reduced ? 'none' : hasSeenIntro() ? 'short' : 'full'))
  const [playing, setPlaying] = useState(mode !== 'none')
  const scope = useRef<HTMLElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  // Giriş sürerken sayfa kaydırılamaz.
  useEffect(() => {
    if (!playing) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      root.style.overflow = previous
      lenis?.start()
    }
  }, [playing, lenis])

  // Giriş sırasında kaydırma kilitliyken kaydırma çubuğu yoktur; pin ölçüleri bu genişlikle alınır.
  // Kilit kalkınca (çubuk geri gelince) yeniden ölçülmezse bölüm yatayda taşar.
  useEffect(() => {
    if (!playing && !reduced) ScrollTrigger.refresh()
  }, [playing, reduced])

  useGSAP(
    () => {
      if (mode === 'none') return
      const q = gsap.utils.selector(scope)
      const finish = () => {
        markIntroSeen()
        setPlaying(false)
      }

      const words = q('[data-hero="word"]')
      const fadeIns = q('[data-hero="fade"]')
      const photo = q('[data-hero="photo"]')

      gsap.set(words, { yPercent: 115 })
      gsap.set(fadeIns, { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({ defaults: { ease: EASE.outExpo }, onComplete: finish })
      timeline.current = tl

      if (mode === 'full') {
        const { width, height, rows } = LOOM
        const rowHeight = height / rows
        const woven = q('[data-loom="woven"]')
        const shuttle = q('[data-loom="shuttle"]')

        gsap.set(photo, { autoAlpha: 0, clipPath: 'inset(20% 36% 20% 36% round 24px)' })
        gsap.set(woven, { attr: { y: height, height: 0 } })

        // 1) Çözgü iplikleri çizilir
        tl.fromTo(
          q('[data-loom="warp"]'),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.8, stagger: { each: 0.012, from: 'center' } },
        )
        // 2) Mekik gidip gelir, her geçişte bir sıra dokunur
        tl.set(shuttle, { opacity: 1, x: 0, y: height })
        for (let row = 0; row < rows; row += 1) {
          const y = height - (row + 1) * rowHeight
          tl.to(shuttle, { x: row % 2 === 0 ? width : 0, y, duration: 0.09, ease: 'none' })
          tl.to(woven, { attr: { y, height: height - y }, duration: 0.09, ease: 'none' }, '<')
        }
        tl.to(shuttle, { opacity: 0, duration: 0.2 })
        // 3) Dokunan halı gerçek fotoğrafa dönüşür
        tl.addLabel('reveal')
        tl.to(photo, { autoAlpha: 1, duration: 0.3 }, 'reveal')
        tl.to(
          photo,
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.9, ease: EASE.inOut },
          'reveal',
        )
        tl.to(
          q('[data-hero="loom"]'),
          { scale: 1.35, autoAlpha: 0, duration: 0.8, ease: EASE.inOut },
          'reveal',
        )
        tl.to(q('[data-hero="backdrop"]'), { autoAlpha: 0, duration: 0.6 }, 'reveal+=0.3')
      } else {
        gsap.set(photo, { autoAlpha: 0, clipPath: 'inset(6% 6% 6% 6% round 24px)' })
        tl.to(photo, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 0.6 })
      }

      // 4) Başlık kelime kelime, ardından metin ve butonlar
      tl.to(words, { yPercent: 0, duration: mode === 'full' ? 1 : 0.6, stagger: 0.08 }, '-=0.35')
      tl.to(fadeIns, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
    },
    { scope, dependencies: [] },
  )

  // Kaydırmaya bağlı sahne (pin + scrub)
  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(scope)
      const header = document.querySelector('header')

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: () => `top ${header?.offsetHeight ?? 0}px`,
            end: '+=100%',
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to(q('[data-hero="scale"]'), { scale: 1.15, ease: 'none', duration: 1 }, 0)
        .to(
          q('[data-hero="content"]'),
          { yPercent: -30, autoAlpha: 0, ease: 'none', duration: 0.55 },
          0,
        )
        .fromTo(
          q('[data-hero="roll"]'),
          // 100 yerine 108: rulonun kavisli üst kenarı başlangıçta görünmesin
          { yPercent: 108 },
          // Tamamen kapatmaz: pin bitince boş bir ekran kaymasın, fotoğrafın üstü görünür kalsın
          { yPercent: 25, ease: 'none', duration: 0.6 },
          0.4,
        )
    },
    { scope, dependencies: [reduced] },
  )

  const accentWords = new Set(hero.titleAccent.split(' ').filter(Boolean))

  return (
    <section
      ref={scope}
      className="relative isolate flex min-h-[calc(100dvh-4.5rem)] items-end overflow-hidden"
    >
      {/* Fotoğraf: dış katman kaydırmayla büyür, iç katman girişte maskeyle açılır */}
      <div data-hero="scale" className="absolute inset-0 -z-20 will-change-transform">
        <div data-hero="photo" className="absolute inset-0">
          <RemoteImage
            src={hero.image}
            alt={hero.imageAlt}
            loading="eager"
            fetchPriority="high"
            className="size-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/70 to-canvas/10"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Giriş: tezgâh */}
      {mode === 'full' && playing && (
        <div className="absolute inset-0 -z-10 flex items-center justify-center" aria-hidden="true">
          <div data-hero="backdrop" className="absolute inset-0 bg-canvas" />
          <div data-hero="loom" className="relative h-[58%] max-h-[640px] will-change-transform">
            <CarpetLoom className="h-full w-auto drop-shadow-2xl" />
          </div>
        </div>
      )}

      <Container className="pt-32 pb-16 sm:pb-24">
        <div data-hero="content">
          <p
            data-hero="fade"
            className="text-xs font-medium tracking-[0.3em] text-accent uppercase"
          >
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(3.5rem,11vw,9rem)] leading-[0.92] font-semibold text-ink">
            {hero.title.split(' ').map((word, index) => (
              <span key={`${word}-${index}`}>
                <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span data-hero="word" className="inline-block will-change-transform">
                    {accentWords.has(word) ? <AccentWord>{word}</AccentWord> : word}
                  </span>
                </span>{' '}
              </span>
            ))}
          </h1>
          <p data-hero="fade" className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            {hero.text}
          </p>
          <div data-hero="fade" className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to={path('collections')}>
              {hero.primaryCta} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              to={path('about')}
              variant="secondary"
              className="bg-canvas/40 backdrop-blur"
            >
              {hero.secondaryCta}
            </ButtonLink>
          </div>
        </div>
      </Container>

      {/* Kaydırınca alttan yukarı kapanan "rulo" (konumu GSAP verir; reduced-motion'da hiç yok) */}
      {!reduced && (
        <div
          data-hero="roll"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-canvas will-change-transform"
        >
          <div className="absolute inset-x-0 -top-6 h-12 rounded-[100%] bg-linear-to-b from-raised to-canvas shadow-2xl shadow-canvas" />
        </div>
      )}

      {playing && (
        <button
          type="button"
          onClick={() => timeline.current?.progress(1)}
          className="absolute right-4 bottom-4 z-20 inline-flex items-center gap-2 rounded-full border border-line bg-canvas/60 px-4 py-2 text-xs font-medium text-muted backdrop-blur transition-colors hover:border-ink/40 hover:text-ink sm:right-6 sm:bottom-6"
        >
          {t.common.skipIntro} <FastForward className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </section>
  )
}
