import { Avatar } from '../atoms/Avatar'
import type { JobCandidate } from '../../types/jobCandidates'
import { mailtoHref, telHref, whatsappHref } from '../../utils/contact'

type CandidateMatchCardProps = {
  candidate: JobCandidate
  jobTitle: string
  position: number
}

const MAX_SKILLS = 8

function matchTone(percent: number) {
  if (percent >= 80) return { box: 'bg-emerald-50 border-emerald-300 text-emerald-900', label: 'Muito compatível' }
  if (percent >= 60) return { box: 'bg-blue-50 border-blue-300 text-blue-900', label: 'Compatível' }
  return { box: 'bg-slate-50 border-slate-300 text-slate-800', label: 'Pouco compatível' }
}

const linkBase =
  'inline-flex items-center justify-center gap-3 px-6 py-4 text-xl font-semibold rounded-2xl min-h-[56px] shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-[#2563eb]/30'

/** Candidate card on the company side: who they are, how compatible, and how to reach them. */
export function CandidateMatchCard({ candidate: c, jobTitle, position }: CandidateMatchCardProps) {
  const tone = matchTone(c.percent)
  const name = c.full_name || 'Candidato sem nome'
  const location = [c.city, c.state].filter(Boolean).join(' / ')
  const firstName = name.split(' ')[0]
  const greeting = `Olá, ${firstName}! Vimos seu perfil no Conecta Sênior e gostaríamos de conversar sobre a vaga "${jobTitle}".`
  const mail = mailtoHref(c.email, `Vaga: ${jobTitle}`)
  const tel = telHref(c.phone)
  const whats = whatsappHref(c.phone, greeting)
  const headingId = `candidate-${c.profile_id}`
  const extraSkills = c.skills.length - MAX_SKILLS

  return (
    <article
      aria-labelledby={headingId}
      className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
      data-testid="candidate-card"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-5">
          <Avatar src={c.photo_url || null} name={name} size="md" />
          <div className="min-w-0">
            <p className="text-lg text-slate-500">{position}º mais compatível</p>
            <h2 id={headingId} className="text-2xl md:text-3xl font-bold text-slate-900 break-words">{name}</h2>
            {c.headline && <p className="text-xl text-slate-700">{c.headline}</p>}
            {location && <p className="text-xl text-slate-600">{location}</p>}
          </div>
        </div>
        <div
          className={`shrink-0 self-start rounded-3xl border-2 px-6 py-4 text-center ${tone.box}`}
          aria-label={`${c.percent}% compatível com a vaga`}
        >
          <p className="text-4xl md:text-5xl font-extrabold leading-none">{c.percent}%</p>
          <p className="mt-1 text-xl font-semibold">compatível</p>
          <p className="text-lg">{tone.label}</p>
        </div>
      </div>

      {c.summary && <p className="text-xl text-slate-700 leading-relaxed">{c.summary}</p>}

      {c.skills.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">Habilidades</h3>
          <ul className="flex flex-wrap gap-2">
            {c.skills.slice(0, MAX_SKILLS).map(skill => (
              <li key={skill} className="px-4 py-2 rounded-full bg-slate-100 text-lg text-slate-800">{skill}</li>
            ))}
            {extraSkills > 0 && <li className="px-4 py-2 text-lg text-slate-500">e mais {extraSkills}</li>}
          </ul>
        </section>
      )}

      {c.experiences.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">Experiências principais</h3>
          <ul className="space-y-3">
            {c.experiences.map((e, i) => (
              <li key={`${e.role}-${e.company}-${i}`} className="border-l-4 border-primary/30 pl-4">
                <p className="text-xl font-semibold text-slate-900">{[e.role, e.company].filter(Boolean).join(' · ')}</p>
                {e.period && <p className="text-lg text-slate-600">{e.period}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3 border-t-2 border-slate-100 pt-6">
        <h3 className="text-xl font-bold text-slate-900">Entrar em contato</h3>
        {mail || tel || whats ? (
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
            {whats && (
              <a href={whats} target="_blank" rel="noopener noreferrer" className={`${linkBase} bg-[#15803d] text-white hover:brightness-95`}
                aria-label={`Conversar com ${name} pelo WhatsApp`}>
                WhatsApp
              </a>
            )}
            {tel && (
              <a href={tel} className={`${linkBase} bg-white border border-slate-300 text-slate-800 hover:bg-slate-50`}
                aria-label={`Ligar para ${name}: ${c.phone}`}>
                Ligar {c.phone}
              </a>
            )}
            {mail && (
              <a href={mail} className={`${linkBase} bg-[#2563eb] text-white hover:brightness-95 break-all`}
                aria-label={`Enviar e-mail para ${name}: ${c.email}`}>
                E-mail
              </a>
            )}
          </div>
        ) : (
          <p className="text-xl text-slate-500">Este candidato ainda não informou um contato.</p>
        )}
        {c.email && <p className="text-lg text-slate-600 break-all">{c.email}</p>}
      </section>
    </article>
  )
}
