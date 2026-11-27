import { describe, it, expect } from 'vitest'
import { homePathFor, redirectFor, roleFromToken } from './roles'

const jwt = (payload: object) => `x.${btoa(JSON.stringify(payload)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')}.sig`

describe('roles', () => {
  it('lê o papel do token', () => {
    expect(roleFromToken(jwt({ role: 'company' }))).toBe('company')
    expect(roleFromToken(jwt({}))).toBeNull()
    expect(roleFromToken('lixo')).toBeNull()
    expect(roleFromToken(null)).toBeNull()
  })
  it('destino padrão por papel', () => {
    expect(homePathFor('company')).toBe('/minhas-vagas')
    expect(homePathFor('candidate')).toBe('/vagas')
    expect(homePathFor(null)).toBe('/vagas')
  })
  it('empresa não acessa telas de candidato', () => {
    expect(redirectFor('/vagas', 'company')).toBe('/minhas-vagas')
    expect(redirectFor('/meu-perfil', 'company')).toBe('/minhas-vagas')
    expect(redirectFor('/comecar/metodo', 'company')).toBe('/minhas-vagas')
    expect(redirectFor('/minhas-vagas', 'company')).toBeNull()
    expect(redirectFor('/vagas/nova', 'company')).toBeNull()
    expect(redirectFor('/vagas/editar/1', 'company')).toBeNull()
    expect(redirectFor('/vagas/1/candidatos', 'company')).toBeNull()
    expect(redirectFor('/minha-empresa', 'company')).toBeNull()
  })
  it('candidato não acessa telas de empresa', () => {
    expect(redirectFor('/minhas-vagas', 'candidate')).toBe('/vagas')
    expect(redirectFor('/vagas/nova', 'candidate')).toBe('/vagas')
    expect(redirectFor('/vagas/1/candidatos', 'candidate')).toBe('/vagas')
    expect(redirectFor('/minha-empresa', 'candidate')).toBe('/vagas')
    expect(redirectFor('/vagas', 'candidate')).toBeNull()
    expect(redirectFor('/comecar/passo/2', 'candidate')).toBeNull()
  })
  it('telas de entrada levam para a home do papel', () => {
    expect(redirectFor('/entrar', 'company')).toBe('/minhas-vagas')
    expect(redirectFor('/', 'candidate')).toBe('/vagas')
  })
})
