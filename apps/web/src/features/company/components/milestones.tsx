export function Milestones({ items }: { items: readonly { year: string; text: string }[] }) {
  return (
    <ol className="relative border-l border-ink-900/15">
      {items.map((item) => (
        <li key={item.year} className="relative pb-10 pl-8 last:pb-0">
          <span
            className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-cream-50 bg-madder-600"
            aria-hidden="true"
          />
          <p className="font-display text-2xl font-medium text-madder-600">{item.year}</p>
          <p className="mt-1 text-ink-700">{item.text}</p>
        </li>
      ))}
    </ol>
  )
}
