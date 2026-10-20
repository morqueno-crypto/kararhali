import { useRef, useState } from 'react'
import { Reveal } from '@/components/ui/reveal'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { DESKTOP_MOTION_QUERY } from '@/lib/motion/constants'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { useMediaQuery } from '@/lib/motion/use-media-query'
import { stepIllustrations } from '../illustrations'

interface Step {
  title: string
  text: string
}

/**
 * Üretim hikâyesi: masaüstünde ekran boyu sabitlenen sahne; kaydırdıkça adımlar ve illüstrasyonlar değişir.
 * Mobilde ve reduced-motion'da pin yok; adımlar dikey listede tek tek görünür olur.
 */
export function ProductionStory({ steps }: { steps: readonly Step[] }) {
  const pinned = useMediaQuery(DESKTOP_MOTION_QUERY)
  return pinned ? <PinnedStory steps={steps} /> : <StackedStory steps={steps} />
}

function PinnedStory({ steps }: { steps: readonly Step[] }) {
  const { t } = useI18n()
  const scope = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const header = document.querySelector('header')
      gsap.to('[data-story="progress"]', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: scope.current,
          start: () => `top ${header?.offsetHeight ?? 0}px`,
          end: () => `+=${window.innerHeight * steps.length * 0.6}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
            setActive((current) => (current === index ? current : index))
          },
        },
      })
    },
    { scope, dependencies: [steps.length] },
  )

  const current = steps[active]

  return (
    <div
      ref={scope}
      className="relative flex h-[calc(100dvh-4.5rem)] flex-col justify-center overflow-hidden"
    >
      <div className="mx-auto w-full max-w-7xl px-8">
        {/* İlerleme */}
        <div className="flex items-center gap-6">
          <span className="text-xs font-medium tracking-[0.25em] text-subtle uppercase tabular-nums">
            {t.home.story.step(active + 1, steps.length)}
          </span>
          <div className="relative h-px flex-1 bg-line">
            <div
              data-story="progress"
              className="absolute inset-0 origin-left scale-x-0 bg-accent"
            />
          </div>
          <ol className="flex gap-2" aria-hidden="true">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  'size-2 rounded-full transition-colors duration-500',
                  index <= active ? 'bg-accent' : 'bg-line',
                )}
              />
            ))}
          </ol>
        </div>

        <div className="mt-14 grid grid-cols-12 items-center gap-12">
          <div className="relative col-span-6 min-h-[22rem]">
            {steps.map((step, index) => (
              <div
                key={step.title}
                aria-hidden={index !== active}
                className={cn(
                  'absolute inset-0 transition-all duration-700 ease-(--ease-out-expo)',
                  index === active
                    ? 'translate-y-0 opacity-100'
                    : index < active
                      ? '-translate-y-8 opacity-0'
                      : 'translate-y-8 opacity-0',
                )}
              >
                <span className="font-display text-[9rem] leading-none font-semibold text-accent/90 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-5xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
            {/* Ekran okuyucular için etkin adım */}
            <p className="sr-only" aria-live="polite">
              {current ? `${current.title}. ${current.text}` : null}
            </p>
          </div>

          {/* İçerik tamamen absolute olduğu için genişlik açıkça verilir (yoksa 0'a çöker) */}
          <div className="relative col-span-6 aspect-square w-full max-w-[min(100%,58dvh)] justify-self-center">
            <div
              className="absolute inset-[8%] rounded-full bg-accent/10 blur-3xl"
              aria-hidden="true"
            />
            {stepIllustrations.map((Illustration, index) => (
              <div
                key={index}
                className={cn(
                  'absolute inset-0 transition-all duration-700 ease-(--ease-out-expo)',
                  index === active ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
                )}
              >
                <Illustration />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StackedStory({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6">
      {steps.map((step, index) => {
        const Illustration = stepIllustrations[index]
        return (
          <Reveal
            as="li"
            key={step.title}
            className="grid items-center gap-6 rounded-3xl border border-line bg-surface p-6 sm:grid-cols-[10rem_1fr] sm:p-8"
          >
            <div className="mx-auto size-36 sm:size-40">{Illustration && <Illustration />}</div>
            <div>
              <span className="font-display text-sm font-medium text-accent tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-2xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}
