import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ThumbProps {
  src: string | null | undefined
  alt?: string
  /** Ürün fotoğrafları için açık zemin + contain */
  paper?: boolean
  className?: string
}

/** Küçük görsel önizleme; yüklenemezse yer tutucu gösterir. */
export function Thumb({ src, alt = '', paper, className }: ThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = !src || failedSrc === src

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line',
        paper ? 'bg-paper' : 'bg-raised',
        className,
      )}
    >
      {failed ? (
        <ImageOff className="size-4 text-subtle" aria-hidden="true" />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn('size-full', paper ? 'object-contain p-0.5' : 'object-cover')}
        />
      )}
    </div>
  )
}
