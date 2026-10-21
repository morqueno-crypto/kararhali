import { Copy, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/form-controls'
import { generatePassword } from './generate-password'

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Verilirse "üret" düğmesi gösterilir */
  onGenerate?: (password: string) => void
}

/** Göster/gizle, kopyala ve isteğe bağlı üret düğmeli şifre alanı */
export function PasswordInput({ onGenerate, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  async function copy() {
    const value = (document.getElementById(props.id ?? '') as HTMLInputElement | null)?.value
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Şifre kopyalandı')
    } catch {
      toast.error('Kopyalanamadı')
    }
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          type={visible ? 'text' : 'password'}
          className={`pr-10 font-mono ${className ?? ''}`}
          autoComplete="new-password"
          spellCheck={false}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Şifreyi gizle' : 'Şifreyi göster'}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-subtle hover:text-ink"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {onGenerate && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="size-10"
            onClick={() => {
              onGenerate(generatePassword())
              setVisible(true)
            }}
            aria-label="Güçlü şifre üret"
            title="Güçlü şifre üret"
          >
            <RefreshCw />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-10"
            onClick={() => void copy()}
            aria-label="Şifreyi kopyala"
            title="Kopyala"
          >
            <Copy />
          </Button>
        </>
      )}
    </div>
  )
}
