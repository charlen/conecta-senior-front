import { HTMLAttributes } from 'react'

type IconProps = HTMLAttributes<HTMLSpanElement> & {
  name?: string
  size?: number
}

export function Icon({ name, size = 24, className = '', ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Placeholder para ícone - pode ser substituído por lucide-react */}
      <span className="text-current">{name || '•'}</span>
    </span>
  )
}
