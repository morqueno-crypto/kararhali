import type { PublicContent } from '@karar-hali/shared'
import { Container } from '@/components/ui/container'
import { Emphasis } from '@/components/ui/emphasis'
import { Reveal } from '@/components/ui/reveal'

type Journey = PublicContent['home.journey']

/** Yolculuğun kapanışı: "Ve sonunda evinizde." Ardından mekân slaytları gelir. */
export function JourneyFinale({ journey, id }: { journey: Journey; id: string }) {
  return (
    <section
      id={id}
      className="relative isolate scroll-mt-18 overflow-hidden py-20 text-center sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 mx-auto h-full max-w-4xl rounded-full bg-accent/10 blur-3xl"
      />
      <Container>
        <Reveal
          as="p"
          variant="tracking"
          className="text-xs font-medium tracking-[0.3em] text-accent uppercase"
        >
          {journey.finaleEyebrow}
        </Reveal>
        <h2 className="mt-5 overflow-hidden text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] font-semibold text-ink">
          <Reveal as="span" variant="mask" className="block">
            <Emphasis text={journey.finaleTitle} accent={journey.finaleTitleAccent} />
          </Reveal>
        </h2>
      </Container>
    </section>
  )
}
