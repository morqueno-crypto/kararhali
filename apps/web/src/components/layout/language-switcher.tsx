import { Link, useLocation } from 'react-router'
import { localeNames, locales, useAlternatePaths, useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

export function LanguageSwitcher({
  className,
  onSelect,
}: {
  className?: string
  onSelect?: () => void
}) {
  const { locale, t } = useI18n()
  const alternates = useAlternatePaths()
  const { search } = useLocation()

  return (
    <nav aria-label={t.common.language} className={cn('flex items-center gap-1', className)}>
      {locales.map((item) => (
        <Link
          key={item}
          to={`${alternates[item]}${search}`}
          lang={item}
          hrefLang={item}
          title={localeNames[item]}
          aria-label={localeNames[item]}
          aria-current={item === locale ? 'true' : undefined}
          onClick={onSelect}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase transition-colors',
            item === locale ? 'bg-ink-950 text-cream-50' : 'text-ink-700 hover:bg-ink-900/5',
          )}
        >
          {item}
        </Link>
      ))}
    </nav>
  )
}
