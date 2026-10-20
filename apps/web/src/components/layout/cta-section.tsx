import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/ui/reveal'
import { useI18n } from '@/i18n'

/** Sayfa sonlarındaki teklif çağrısı (GSAP'sız; tüm sayfalarda kullanılabilir). */
export function CtaSection() {
  const { t, path } = useI18n()

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal
          variant="scale"
          className="group relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface px-8 py-16 sm:px-16 sm:py-20"
        >
          <div
            className="absolute -top-32 -right-32 -z-10 size-96 rounded-full bg-accent/20 blur-3xl transition-transform duration-[1.5s] ease-(--ease-out-expo) group-hover:scale-125"
            aria-hidden="true"
          />
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold text-ink sm:text-5xl">{t.cta.title}</h2>
            <p className="mt-5 text-lg text-muted">{t.cta.text}</p>
            <ButtonLink to={path('contact')} className="mt-10">
              {t.cta.button} <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
