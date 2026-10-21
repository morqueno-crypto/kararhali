import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Thumb } from '@/components/ui/thumb'
import { cn } from '@/lib/cn'
import { MediaPicker } from './media-picker'

interface ImageFieldProps {
  value: string | null | undefined
  onChange: (value: string | null) => void
  /** Boş bırakılabilir mi (ör. koleksiyon kapağı) */
  nullable?: boolean
  /** Ürün fotoğrafı (açık zemin, contain) */
  paper?: boolean
  invalid?: boolean
  className?: string
  id?: string
}

/** Form içinde görsel alanı: önizleme + değiştir/kaldır. Seçim MediaPicker ile yapılır. */
export function ImageField({
  value,
  onChange,
  nullable,
  paper,
  invalid,
  className,
  id,
}: ImageFieldProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      id={id}
      className={cn(
        'flex items-center gap-4 rounded-xl border bg-canvas p-3',
        invalid ? 'border-danger' : 'border-line',
        className,
      )}
    >
      <Thumb src={value} paper={paper} className="size-20" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-subtle" title={value ?? undefined}>
          {value || 'Görsel seçilmedi'}
        </p>
        <div className="mt-2 flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            <ImagePlus /> {value ? 'Değiştir' : 'Görsel seç'}
          </Button>
          {nullable && value && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              <X /> Kaldır
            </Button>
          )}
        </div>
      </div>
      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        value={value ?? undefined}
        onSelect={(url) => onChange(url)}
      />
    </div>
  )
}
