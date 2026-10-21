const dateTime = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const dateOnly = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' })
const relative = new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' })

export function formatDateTime(value: string | null | undefined) {
  return value ? dateTime.format(new Date(value)) : '—'
}

export function formatShortDate(value: string) {
  return dateOnly.format(new Date(value))
}

/** "3 dakika önce", "dün" ... */
export function formatRelative(value: string | null | undefined) {
  if (!value) return '—'
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'az önce'
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('tr-TR').format(value)
}

/** "Laguna Gri" → "laguna-gri" (Türkçe karakterler sadeleştirilir) */
export function slugify(value: string) {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => map[char] ?? char)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** "Ayşe Yılmaz" → "AY" */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('')
}
