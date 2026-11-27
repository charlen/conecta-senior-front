import { PageTemplate } from '../components/templates/PageTemplate'
import { ProfileReviewFlow } from '../components/organisms/ProfileReviewFlow'
import { Button } from '../components/atoms/Button'

export default function PerfilPage() {
  return (
    <PageTemplate>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">Meu perfil</h1>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed">
            É com estas informações que encontramos as vagas mais compatíveis com você. Toque em Alterar para mudar uma parte.
          </p>
        </header>

        <ProfileReviewFlow mode="profile" />

        <div className="flex flex-col gap-4 border-t-2 border-slate-100 pt-8 md:flex-row md:justify-between">
          <Button variant="secondary" onClick={() => (window.location.href = '/vagas')}>Voltar para as vagas</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/comecar/curriculo')}>
            Preencher a partir de um currículo (PDF)
          </Button>
        </div>
      </div>
    </PageTemplate>
  )
}
