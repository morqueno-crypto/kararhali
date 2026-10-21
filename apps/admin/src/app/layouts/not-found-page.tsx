import { Compass } from 'lucide-react'
import { Link } from 'react-router'
import { buttonClass } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/feedback'

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Sayfa bulunamadı"
        description="Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir."
        action={
          <Link to="/" className={buttonClass('secondary')}>
            Panele dön
          </Link>
        }
      />
    </Card>
  )
}
