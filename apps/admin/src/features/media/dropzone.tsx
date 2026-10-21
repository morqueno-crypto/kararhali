import { allowedImageTypes, maxUploadBytes } from '@karar-hali/shared'
import { UploadCloud } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { errorMessage } from '@/lib/http'
import { useUploadMedia } from './api'

interface DropzoneProps {
  /** Yükleme bitince (her dosya için) çağrılır */
  onUploaded?: (url: string) => void
  multiple?: boolean
  className?: string
}

/** Sürükle-bırak veya tıklayarak görsel yükleme. Dosyalar sırayla yüklenir. */
export function Dropzone({ onUploaded, multiple = true, className }: DropzoneProps) {
  const input = useRef<HTMLInputElement>(null)
  const upload = useUploadMedia()
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  async function handleFiles(fileList: FileList | null) {
    const files = [...(fileList ?? [])].slice(0, multiple ? 50 : 1)
    if (files.length === 0) return
    setProgress({ done: 0, total: files.length })
    let succeeded = 0
    for (const [index, file] of files.entries()) {
      if (!(allowedImageTypes as readonly string[]).includes(file.type)) {
        toast.error(`${file.name}: yalnızca JPEG, PNG, WebP veya AVIF yüklenebilir`)
      } else if (file.size > maxUploadBytes) {
        toast.error(`${file.name}: dosya 10 MB'tan büyük`)
      } else {
        try {
          const { media } = await upload.mutateAsync({ file })
          succeeded += 1
          onUploaded?.(media.url)
        } catch (error) {
          toast.error(`${file.name}: ${errorMessage(error)}`)
        }
      }
      setProgress({ done: index + 1, total: files.length })
    }
    setProgress(null)
    if (input.current) input.current.value = ''
    if (succeeded > 0) toast.success(`${succeeded} görsel yüklendi`)
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()
    setDragging(false)
    void handleFiles(event.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors',
        dragging ? 'border-accent bg-accent/5' : 'hover:border-line-strong border-line',
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
        <UploadCloud className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-semibold text-ink">
        {progress
          ? `Yükleniyor… ${progress.done} / ${progress.total}`
          : 'Görselleri buraya sürükleyin'}
      </p>
      <p className="mt-1 text-xs text-subtle">
        veya{' '}
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={!!progress}
          className="font-semibold text-accent hover:underline"
        >
          bilgisayardan seçin
        </button>{' '}
        · JPEG, PNG, WebP, AVIF · en fazla 10 MB
      </p>
      <input
        ref={input}
        type="file"
        accept={allowedImageTypes.join(',')}
        multiple={multiple}
        onChange={(event) => void handleFiles(event.target.files)}
        className="sr-only"
        aria-label="Görsel dosyası seç"
        tabIndex={-1}
      />
    </div>
  )
}
