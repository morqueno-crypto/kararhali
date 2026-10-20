import { cn } from '@/lib/cn'
import { useSite } from '@/site'

/** Panelden yönetilen logo (koyu tema için açık renkli, şeffaf zeminli olmalı). */
export function Logo({ className }: { className?: string }) {
  const { general } = useSite().settings
  return (
    <img
      src={general.logo}
      alt={general.siteName}
      width={242}
      height={81}
      className={cn('h-10 w-auto', className)}
    />
  )
}
