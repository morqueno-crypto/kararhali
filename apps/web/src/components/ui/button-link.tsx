import { Link, type LinkProps } from 'react-router'
import { buttonClass, type ButtonVariant } from './button-styles'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
}

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, className)} {...props} />
}
