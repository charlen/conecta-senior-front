import { Heading } from '../components/atoms/Heading'
import { Text } from '../components/atoms/Text'
import { Button } from '../components/atoms/Button'
import { useRascunhoPerfil } from '../hooks/useRascunhoPerfil'

export default function RevisaoPage() {
  const { rascunho, salvarPerfil } = useRascunhoPerfil()
  const aiRaw = localStorage.getItem('cs_resume_ai')
  const ai = aiRaw ? JSON.parse(aiRaw) : null

  const confirmar = async () => {
    await salvarPerfil()
    window.location.href = '/comecar/confirmado'
  }

  const experiencias = ai?.parsed?.experience || rascunho.perfil.experiencias.map(e=>({company:e.empresa, role:e.cargo, period:e.periodo}))
  const formacao = ai?.parsed?.education || rascunho.perfil.formacao.map(f=>({institution:f.instituicao, degree:f.curso}))
  const habilidades = ai?.parsed?.skills || rascunho.perfil.habilidades

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-3xl mx-auto">
        <Heading>Revisão do perfil</Heading>
        <Text className="mt-2">Confira os dados antes de confirmar</Text>
        <div className="bg-white rounded-xl p-6 mt-4 space-y-6">
          <section>
            <Heading level={3} className="text-xl mb-3">Dados básicos</Heading>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Nome</span><p className="font-medium">{rascunho.perfil.dadosBasicos.nomeCompleto || '-'}</p></div>
              <div><span className="text-gray-500">Cidade</span><p className="font-medium">{rascunho.perfil.dadosBasicos.cidade}</p></div>
              <div><span className="text-gray-500">Estado</span><p className="font-medium">{rascunho.perfil.dadosBasicos.estado}</p></div>
              <div><span className="text-gray-500">Telefone</span><p className="font-medium">{rascunho.perfil.dadosBasicos.telefone}</p></div>
            </div>
          </section>

          {ai && (
            <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <Heading level={3} className="text-xl mb-3">Resumo profissional</Heading>
              <p className="text-sm leading-relaxed mb-3">{ai.resume?.profile_summary || '-'}</p>
              <p className="text-sm text-gray-700"><strong>O que faz:</strong> {ai.resume?.what_does || '-'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(ai.resume?.core_competencies || []).map((c,i)=><span key={i} className="px-2 py-1 bg-white rounded-full text-xs border">{c}</span>)}
              </div>
            </section>
          )}

          <section>
            <Heading level={3} className="text-xl mb-3">Experiência</Heading>
            <div className="space-y-3">
              {experiencias.map((exp,i)=>(
                <div key={i} className="border-l-2 border-primary pl-3">
                  <p className="font-medium">{exp.role || exp.cargo} @ {exp.company || exp.empresa}</p>
                  <p className="text-sm text-gray-600">{exp.period || exp.periodo}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <Heading level={3} className="text-xl mb-3">Formação</Heading>
            <div className="space-y-2">
              {formacao.map((f,i)=>(
                <div key={i}>
                  <p className="font-medium">{f.degree || f.curso}</p>
                  <p className="text-sm text-gray-600">{f.institution || f.instituicao}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <Heading level={3} className="text-xl mb-3">Habilidades</Heading>
            <div className="flex flex-wrap gap-2">
              {habilidades.map((h,i)=><span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{h}</span>)}
            </div>
          </section>

          <section>
            <Heading level={3} className="text-xl mb-3">Preferências</Heading>
            <p className="text-sm">Tipo: <strong>{rascunho.perfil.preferencias.tipoVaga}</strong></p>
            <p className="text-sm">Local: <strong>{rascunho.perfil.preferencias.localidade}</strong></p>
          </section>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={() => window.location.href = '/comecar/passo/6'}>Voltar</Button>
          <Button variant="primary" onClick={confirmar}>Confirmar</Button>
        </div>
      </div>
    </div>
  )
}
