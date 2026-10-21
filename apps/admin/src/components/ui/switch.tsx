import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '@/lib/cn'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  id?: string
  className?: string
}

export function Switch({ checked, onCheckedChange, disabled, label, id, className }: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-line bg-raised transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        className,
      )}
    >
      <SwitchPrimitive.Thumb className="block size-3.5 translate-x-0.5 rounded-full bg-muted shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-on-accent" />
    </SwitchPrimitive.Root>
  )
}
