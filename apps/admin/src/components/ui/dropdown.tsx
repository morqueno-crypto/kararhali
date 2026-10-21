import { DropdownMenu } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const Dropdown = DropdownMenu.Root
export const DropdownTrigger = DropdownMenu.Trigger

export function DropdownContent({
  children,
  align = 'end',
}: {
  children: ReactNode
  align?: 'start' | 'end'
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={6}
        className="animate-fade-in z-50 min-w-44 rounded-xl border border-line bg-surface p-1 shadow-2xl shadow-black/50"
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  )
}

interface DropdownItemProps {
  onSelect?: () => void
  danger?: boolean
  children: ReactNode
}

export function DropdownItem({ onSelect, danger, children }: DropdownItemProps) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none select-none data-highlighted:bg-raised [&_svg]:size-4',
        danger ? 'text-danger' : 'text-ink',
      )}
    >
      {children}
    </DropdownMenu.Item>
  )
}

export function DropdownSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-line" />
}
