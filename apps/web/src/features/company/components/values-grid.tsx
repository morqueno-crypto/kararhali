import { Gem, Handshake, Leaf, PenTool } from 'lucide-react'

const icons = [Gem, Leaf, PenTool, Handshake]

export function ValuesGrid({ values }: { values: readonly { title: string; text: string }[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {values.map((value, index) => {
        const Icon = icons[index % icons.length]
        return (
          <div key={value.title} className="rounded-2xl bg-cream-100 p-8 ring-1 ring-ink-900/5">
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-madder-600/10 text-madder-600">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-xl font-medium text-ink-950">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{value.text}</p>
          </div>
        )
      })}
    </div>
  )
}
