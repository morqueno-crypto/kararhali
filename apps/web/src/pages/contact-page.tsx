import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { siteConfig } from '@/config/site'
import { ContactForm } from '@/features/contact'
import { useI18n } from '@/i18n'

export function ContactPage() {
  const { t } = useI18n()
  const { contact } = siteConfig
  const labels = t.contact.info
  const items = [
    { icon: MapPin, label: labels.address, value: t.contactInfo.address },
    {
      icon: Phone,
      label: labels.phone,
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
    },
    { icon: Mail, label: labels.email, value: contact.email, href: `mailto:${contact.email}` },
    { icon: Clock, label: labels.hours, value: t.contactInfo.hours },
  ]

  return (
    <>
      <PageMeta title={t.nav.contact} description={t.contact.metaDescription} />
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        description={t.contact.description}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5">
            <ul className="space-y-6 rounded-2xl bg-cream-100 p-8 ring-1 ring-ink-900/5">
              {items.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-madder-600/10 text-madder-600">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-ink-500">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium text-ink-950 hover:text-madder-600">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-ink-950">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </Container>
      </section>
    </>
  )
}
