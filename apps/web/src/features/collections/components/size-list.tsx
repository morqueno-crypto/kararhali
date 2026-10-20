import { useI18n } from '@/i18n'
import { formatSize } from '../format-size'

export function SizeList({ sizes }: { sizes: readonly string[] }) {
  const { t } = useI18n()

  return (
    <ul className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <li
          key={size}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm text-muted tabular-nums"
        >
          {formatSize(size, t)}
        </li>
      ))}
    </ul>
  )
}
