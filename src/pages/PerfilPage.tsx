import { PageTemplate } from '../components/templates/PageTemplate'
import { ProfileEditor } from '../components/organisms/ProfileEditor'
import { Alerta } from '../components/molecules/Alerta'
import { Button } from '../components/atoms/Button'
import { Spinner } from '../components/atoms/Spinner'
import { useCandidateProfile } from '../hooks/useCandidateProfile'

export default function PerfilPage() {
  const { profile, setProfile, errors, status, message, save } = useCandidateProfile()

  return (
    <PageTemplate>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Meu perfil</h1>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            É com estas informações que encontramos as vagas mais compatíveis com você.
          </p>
        </header>

        {status === 'loading' && (
          <div className="flex items-center gap-4 text-xl" role="status"><Spinner /> Carregando seu perfil...</div>
        )}
        {status === 'saved' && <Alerta tipo="sucesso">Perfil salvo! As vagas compatíveis já consideram as mudanças.</Alerta>}
        {message && <Alerta tipo="erro">{message}</Alerta>}

        {profile && (
          <>
            <div className="flex flex-col gap-4 md:flex-row">
              <Button variant="secondary" className="md:flex-1" onClick={() => (window.location.href = '/comecar/curriculo')}>
                Atualizar com um novo currículo (PDF)
              </Button>
            </div>
            <ProfileEditor value={profile} onChange={setProfile} errors={errors} />
          </>
        )}

        <div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
          <Button variant="secondary" onClick={() => (window.location.href = '/vagas')}>Voltar para as vagas</Button>
          <Button variant="primary" onClick={save} disabled={!profile || status === 'saving'}>
            {status === 'saving' ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </PageTemplate>
  )
}
