import { BarraProgresso } from '../components/molecules/BarraProgresso'
import { Button } from '../components/atoms/Button'
import { Heading } from '../components/atoms/Heading'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Textarea } from '../components/atoms/Textarea'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'

const TOTAL = 7

export default function WizardPage() {
  const path = window.location.pathname
  const match = path.match(/\/comecar\/passo\/(\d+)/)
  const passo = match ? Number(match[1]) : 1

  const voltar = () => {
    if (passo > 1) window.location.href = `/comecar/passo/${passo - 1}`
  }
  const continuar = () => {
    if (passo < TOTAL) window.location.href = `/comecar/passo/${passo + 1}`
    else window.location.href = '/comecar/revisao'
  }

  const renderStep = () => {
    switch (passo) {
      case 1: return <StepDadosBasicos />
      case 2: return <StepExperiencias />
      case 3: return <StepFormacao />
      case 4: return <StepHabilidades />
      case 5: return <StepPreferencias />
      case 6: return <StepSobreMim />
      default: return <p className="text-lg text-text-secondary">Conteúdo do passo {passo}</p>
    }
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-3xl mx-auto">
        <BarraProgresso passoAtual={passo} totalPassos={TOTAL} />
        <Heading className="mt-6">Passo {passo} de {TOTAL}</Heading>
        <div className="bg-white rounded-xl p-6 mt-4">
          {renderStep()}
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={voltar} disabled={passo === 1}>Voltar</Button>
          <Button variant="primary" onClick={continuar}>Continuar</Button>
        </div>
      </div>
    </div>
  )
}

function StepDadosBasicos() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  const { cidade, estado, telefone } = rascunho.perfil.dadosBasicos
  return (
    <div className="space-y-4">
      <Label htmlFor="cidade">Cidade</Label>
      <Input id="cidade" value={cidade} onChange={e => atualizarPerfil({ dadosBasicos: { ...rascunho.perfil.dadosBasicos, cidade: e.target.value } })} />
      <Label htmlFor="estado">Estado</Label>
      <Input id="estado" value={estado} onChange={e => atualizarPerfil({ dadosBasicos: { ...rascunho.perfil.dadosBasicos, estado: e.target.value } })} />
      <Label htmlFor="telefone">Telefone</Label>
      <Input id="telefone" value={telefone} onChange={e => atualizarPerfil({ dadosBasicos: { ...rascunho.perfil.dadosBasicos, telefone: e.target.value } })} />
    </div>
  )
}

function StepExperiencias() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  const add = () => {
    const novas = [...rascunho.perfil.experiencias, { cargo: '', empresa: '', inicio: '' }]
    atualizarPerfil({ experiencias: novas })
  }
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Experiências</p>
      {rascunho.perfil.experiencias.map((exp, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          <Input placeholder="Cargo" value={exp.cargo} onChange={e => { const novas = [...rascunho.perfil.experiencias]; novas[i].cargo = e.target.value; atualizarPerfil({ experiencias: novas }) }} />
          <Input placeholder="Empresa" value={exp.empresa} onChange={e => { const novas = [...rascunho.perfil.experiencias]; novas[i].empresa = e.target.value; atualizarPerfil({ experiencias: novas }) }} />
        </div>
      ))}
      <Button variant="secondary" onClick={add}>Adicionar outra</Button>
    </div>
  )
}

function StepFormacao() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  const add = () => {
    const novas = [...rascunho.perfil.formacao, { curso: '', instituicao: '' }]
    atualizarPerfil({ formacao: novas })
  }
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Formação</p>
      {rascunho.perfil.formacao.map((f, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          <Input placeholder="Curso" value={f.curso} onChange={e => { const novas = [...rascunho.perfil.formacao]; novas[i].curso = e.target.value; atualizarPerfil({ formacao: novas }) }} />
          <Input placeholder="Instituição" value={f.instituicao} onChange={e => { const novas = [...rascunho.perfil.formacao]; novas[i].instituicao = e.target.value; atualizarPerfil({ formacao: novas }) }} />
        </div>
      ))}
      <Button variant="secondary" onClick={add}>Adicionar outra</Button>
    </div>
  )
}

function StepHabilidades() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  const sugestoes = ['Comunicação', 'Liderança', 'Atendimento', 'Organização']
  const toggle = (h: string) => {
    const set = new Set(rascunho.perfil.habilidades)
    set.has(h) ? set.delete(h) : set.add(h)
    atualizarPerfil({ habilidades: Array.from(set) })
  }
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium">Habilidades</p>
      <div className="flex flex-wrap gap-2">
        {sugestoes.map(s => (
          <Button key={s} variant={rascunho.perfil.habilidades.includes(s) ? 'primary' : 'secondary'} onClick={() => toggle(s)}>{s}</Button>
        ))}
      </div>
    </div>
  )
}

function StepPreferencias() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  return (
    <div className="space-y-4">
      <Label htmlFor="tipo">Tipo de vaga</Label>
      <Input id="tipo" value={rascunho.perfil.preferencias.tipoVaga || ''} onChange={e => atualizarPerfil({ preferencias: { ...rascunho.perfil.preferencias, tipoVaga: e.target.value } })} />
      <Label htmlFor="local">Localidade</Label>
      <Input id="local" value={rascunho.perfil.preferencias.localidade || ''} onChange={e => atualizarPerfil({ preferencias: { ...rascunho.perfil.preferencias, localidade: e.target.value } })} />
    </div>
  )
}

function StepSobreMim() {
  const { rascunho, atualizarPerfil } = useRascunhoPerfil()
  return (
    <div className="space-y-4">
      <Label htmlFor="sobre">Sobre você</Label>
      <Textarea id="sobre" value={rascunho.perfil.sobreMim || ''} onChange={e => atualizarPerfil({ sobreMim: e.target.value })} />
    </div>
  )
}
