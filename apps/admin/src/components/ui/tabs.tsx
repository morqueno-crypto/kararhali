import { Tabs as TabsPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export const Tabs = TabsPrimitive.Root
export const TabsContent = TabsPrimitive.Content

interface TabsListProps {
  items: { value: string; label: ReactNode }[]
  className?: string
}

/** Hap şeklinde sekme listesi; aktif sekme altın vurgulu. */
export function TabsList({ items, className }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-line bg-canvas p-1',
        className,
      )}
    >
      {items.map((item) => (
        <TabsPrimitive.Trigger
          key={item.value}
          value={item.value}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink data-[state=active]:bg-accent data-[state=active]:text-on-accent"
        >
          {item.label}
        </TabsPrimitive.Trigger>
      ))}
    </TabsPrimitive.List>
  )
}
