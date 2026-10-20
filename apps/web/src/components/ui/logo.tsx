import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/** kararhali.com'daki beyaz, şeffaf zeminli logo (koyu tema için). */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={242}
      height={81}
      className={cn('h-10 w-auto', className)}
    />
  )
}
