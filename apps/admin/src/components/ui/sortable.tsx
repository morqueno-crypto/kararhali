import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface SortableRenderProps {
  ref: (node: HTMLElement | null) => void
  style: CSSProperties
  isDragging: boolean
  /** Sürükleme tutamacı (fare ve klavye: boşluk ile tut, oklarla taşı, boşluk ile bırak) */
  handle: ReactNode
}

interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => number
  onReorder: (items: T[]) => void
  layout?: 'list' | 'grid'
  disabled?: boolean
  renderItem: (item: T, sortable: SortableRenderProps) => ReactNode
}

/** Sürükle-bırak ile sıralanabilir liste/ızgara (dnd-kit; fare, dokunmatik ve klavye). */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  layout = 'list',
  disabled,
  renderItem,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return
    const from = items.findIndex((item) => getId(item) === active.id)
    const to = items.findIndex((item) => getId(item) === over.id)
    if (from >= 0 && to >= 0) onReorder(arrayMove(items, from, to))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={items.map(getId)}
        strategy={layout === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
        disabled={disabled}
      >
        {items.map((item) => (
          <SortableItem key={getId(item)} id={getId(item)} disabled={disabled}>
            {(props) => renderItem(item, props)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}

function SortableItem({
  id,
  disabled,
  children,
}: {
  id: number
  disabled?: boolean
  children: (props: SortableRenderProps) => ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      disabled={disabled}
      aria-label="Sırayı değiştirmek için sürükleyin"
      title={disabled ? 'Sıralama için filtreleri temizleyin' : 'Sürükleyerek sırala'}
      className={cn(
        'rounded-md p-1 text-subtle transition-colors',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-grab hover:bg-raised hover:text-ink active:cursor-grabbing',
      )}
    >
      <GripVertical className="size-4" />
    </button>
  )

  return children({
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : undefined,
      position: 'relative',
    },
    isDragging,
    handle,
  })
}
