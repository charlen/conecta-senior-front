export type Experiencia = {
  cargo: string
  empresa: string
  inicio: string
  fim?: string
  descricao?: string
}

export type Formacao = {
  curso: string
  instituicao: string
  anoConclusao?: string
}

export type Perfil = {
  dadosBasicos: {
    nomeCompleto: string
    anoNascimento?: number
    cidade: string
    estado: string
    telefone: string
  }
  experiencias: Experiencia[]
  formacao: Formacao[]
  habilidades: string[]
  preferencias: {
    tipoVaga?: string
    localidade?: string
    modalidade?: string
    disponibilidade?: string
  }
  sobreMim?: string
}

export type MetodoPreenchimento = 'pdf' | 'manual' | 'voz' | null

export type RascunhoPerfil = {
  metodo?: MetodoPreenchimento
  perfil: Perfil
  progresso: string
}
