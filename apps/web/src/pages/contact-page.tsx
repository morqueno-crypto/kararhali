import { Clock, Mail, MapPin, Phone, Printer } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { PageHero } from '@/components/ui/page-hero'
import { PageMeta } from '@/components/ui/page-meta'
import { ContactForm } from '@/features/contact'
import { useI18n } from '@/i18n'
import { useSite } from '@/site'

export function ContactPage() {
  const { t } = useI18n()
  const { settings, content } = useSite()
  const { contact } = settings
  const page = content['contact.page']
  const labels = t.contact.info
  const items = [
    { icon: MapPin, label: labels.address, value: contact.address },
    {
      icon: Phone,
      label: labels.phone,
      value: contact.phoneLines,
      href: `tel:${contact.phone.replace(/[^\d+]/g, '')}`,
    },
    { icon: Printer, label: labels.fax, value: contact.fax },
    { icon: Mail, label: labels.email, value: contact.email, href: `mailto:${contact.email}` },
    { icon: Clock, label: labels.hours, value: contact.hours },
  ].filter((item) => item.value) // panelde boş bırakılan alanlar (ör. faks) gösterilmez

  return (
    <>
      <PageMeta title={t.nav.contact} description={page.description} />
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />

      <section className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="lg:col-span-5">
            <ul className="space-y-6 rounded-3xl border border-line bg-surface p-8 sm:p-10">
              {items.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-subtle">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium text-ink hover:text-accent">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-ink">{value}</p>
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
