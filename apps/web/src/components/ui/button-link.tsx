import { Link, type LinkProps } from 'react-router'
import { useMagnetic } from '@/lib/motion/pointer-effects'
import { buttonClass, type ButtonVariant } from './button-styles'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
}

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  const magnetic = useMagnetic<HTMLAnchorElement>()
  return <Link className={buttonClass(variant, className)} {...magnetic} {...props} />
}
