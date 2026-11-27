type AvatarProps = {
  src?: string | null
  name: string
  size?: 'md' | 'lg' | 'xl'
}

const sizes = { md: 'h-16 w-16 text-2xl', lg: 'h-28 w-28 text-4xl', xl: 'h-44 w-44 text-6xl' }

/** Round profile photo with initials fallback. */
export function Avatar({ src, name, size = 'lg' }: AvatarProps) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const initials = (words.length > 1 ? [words[0], words[words.length - 1]] : words).map(w => w[0]?.toUpperCase()).join('') || '?'
  return src ? (
    <img src={src} alt={`Foto de ${name || 'perfil'}`} className={`${sizes[size]} rounded-full object-cover border-4 border-primary/20`} />
  ) : (
    <div role="img" aria-label={`Sem foto. Iniciais ${initials}`}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary border-4 border-primary/20`}>
      {initials}
    </div>
  )
}
