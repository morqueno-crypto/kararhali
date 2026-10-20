import { Link, useLocation } from 'react-router'
import { localeNames, locales, useAlternatePaths, useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

interface LanguageSwitcherProps {
  className?: string
  onSelect?: () => void
}

export function LanguageSwitcher({ className, onSelect }: LanguageSwitcherProps) {
  const { locale, t } = useI18n()
  const alternates = useAlternatePaths()
  const { search } = useLocation()

  return (
    <nav
      aria-label={t.common.language}
      className={cn('flex items-center rounded-full border border-line p-0.5', className)}
    >
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
            item === locale ? 'bg-ink text-canvas' : 'text-muted hover:text-ink',
          )}
        >
          {item}
        </Link>
      ))}
    </nav>
  )
}
