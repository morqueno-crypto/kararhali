import { Maximize2, X } from 'lucide-react'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { RemoteImage } from '@/components/ui/remote-image'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { FINE_POINTER_QUERY } from '@/lib/motion/constants'
import { matchesQuery } from '@/lib/motion/use-media-query'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

/**
 * Ürün fotoğrafı:
 * - masaüstünde (ince işaretçi) imlecin altında büyüteç,
 * - tıklayınca / dokununca tam ekran görünüm (<dialog>),
 * - görsel değişince (renk seçenekleri) önceki görselin üzerinden crossfade.
 */
export function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const { t } = useI18n()
  const lens = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [layers, setLayers] = useState([src])

  // Yeni görsel geldiğinde önceki altta kalır, yenisi üstte yumuşakça belirir (render sırasında türetilen state).
  if (layers[layers.length - 1] !== src) {
    setLayers((current) => [...current.slice(-1), src])
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!lens.current || !matchesQuery(FINE_POINTER_QUERY)) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    lens.current.style.setProperty('--zoom-x', `${x}%`)
    lens.current.style.setProperty('--zoom-y', `${y}%`)
  }

  return (
    <>
      <button
        type="button"
        onPointerMove={onPointerMove}
        onClick={() => dialog.current?.showModal()}
        aria-label={t.common.zoom}
        className={cn(
          'group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl border border-line bg-paper',
          className,
        )}
      >
        <div className="relative aspect-11/16 p-6 sm:p-10">
          {layers.map((layer, index) => (
            <RemoteImage
              key={layer}
              src={layer}
              alt={index === layers.length - 1 ? alt : ''}
              loading="eager"
              className="absolute inset-6 size-[calc(100%-3rem)] object-contain sm:inset-10 sm:size-[calc(100%-5rem)]"
            />
          ))}
        </div>
        {/* Büyüteç: sadece ince işaretçili cihazlarda hover ile görünür */}
        <div
          ref={lens}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-paper bg-no-repeat opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:group-hover:opacity-100"
          style={
            {
              backgroundImage: `url("${src}")`,
              backgroundSize: '240%',
              backgroundPosition: 'var(--zoom-x, 50%) var(--zoom-y, 50%)',
            } as CSSProperties
          }
        />
        <span className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-canvas/70 text-ink backdrop-blur transition-transform duration-300 group-hover:scale-110">
          <Maximize2 className="size-4" aria-hidden="true" />
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-canvas/95 backdrop:backdrop-blur-sm open:flex"
      >
        <div className="flex h-dvh w-screen items-center justify-center p-4 sm:p-10">
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full rounded-2xl bg-paper object-contain"
          />
        </div>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="fixed top-4 right-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-ink/40"
        >
          <X className="size-4" aria-hidden="true" /> {t.common.close}
        </button>
      </dialog>
    </>
  )
}
