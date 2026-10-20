import { ButtonLink } from '@/components/ui/button-link'
import { Container } from '@/components/ui/container'

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-madder-600 px-8 py-16 sm:px-16">
          <svg
            className="absolute inset-y-0 right-0 h-full w-1/2 opacity-15"
            viewBox="0 0 200 200"
            preserveAspectRatio="xMaxYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern id="cta-diamonds" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 2 L38 20 L20 38 L2 20Z" fill="none" stroke="#fff" strokeWidth="2" />
                <path d="M20 12 L28 20 L20 28 L12 20Z" fill="#fff" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#cta-diamonds)" />
          </svg>
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-medium text-cream-50 sm:text-4xl">
              Bayilik, ihracat ve proje çözümleri için bizimle çalışın.
            </h2>
            <p className="mt-4 text-lg text-cream-100">
              Otel, ofis ve perakende projelerinize özel ölçü, desen ve renk seçenekleriyle teklif
              hazırlayalım.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to="/iletisim" variant="light">
                Teklif isteyin
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
