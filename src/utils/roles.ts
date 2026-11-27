/** Role-based routing: companies and candidates have separate areas. */

export type Role = 'company' | 'candidate'

/** Reads `role` from a JWT payload without verifying it (the API verifies). */
export function roleFromToken(token: string | null | undefined): string | null {
  if (!token) return null
  try {
    const part = token.split('.')[1] ?? ''
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as { role?: unknown }
    return typeof payload.role === 'string' ? payload.role : null
  } catch {
    return null
  }
}

/** Default landing page after login for each role (unknown roles are candidates). */
export function homePathFor(role: string | null | undefined): string {
  return role === 'company' ? '/minhas-vagas' : '/vagas'
}

/** Screens only companies use */
export function isCompanyOnlyPath(path: string): boolean {
  return (
    path === '/minhas-vagas' ||
    path === '/minha-empresa' ||
    path === '/vagas/nova' ||
    path.startsWith('/vagas/editar/') ||
    /^\/vagas\/[^/]+\/candidatos\/?$/.test(path)
  )
}

/** Screens only candidates use (companies have no candidate profile) */
export function isCandidateOnlyPath(path: string): boolean {
  return path === '/vagas' || path === '/meu-perfil' || path === '/comecar' || path.startsWith('/comecar/')
}

/**
 * Where a logged-in user must be sent when opening `path`, or null to stay.
 * Anything outside the role's area (including public entry pages such as
 * /entrar) goes to the role's home, as before.
 */
export function redirectFor(path: string, role: string | null | undefined): string | null {
  const home = homePathFor(role)
  if (role === 'company') return isCompanyOnlyPath(path) ? null : home
  return isCandidateOnlyPath(path) ? null : home
}
