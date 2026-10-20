import { ImageOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'

interface RemoteImageProps extends ComponentProps<'img'> {
  alt: string
}

/** Uzak görsel: tembel yükleme, yüklenince yumuşak geçiş, hata durumunda yer tutucu. */
export function RemoteImage({ className, alt, src, loading = 'lazy', ...props }: RemoteImageProps) {
  // Durum src'ye bağlı tutulur; aynı bileşen yeni bir görselle yeniden kullanıldığında sıfırlanır.
  const [result, setResult] = useState<{ src?: string; status: 'loaded' | 'error' }>()
  const status = result && result.src === src ? result.status : 'loading'

  if (status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('flex items-center justify-center bg-raised text-subtle', className)}
      >
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onLoad={() => setResult({ src, status: 'loaded' })}
      onError={() => setResult({ src, status: 'error' })}
      className={cn(
        'transition-opacity duration-700',
        status === 'loaded' ? 'opacity-100' : 'opacity-0',
        className,
      )}
      {...props}
    />
  )
}
