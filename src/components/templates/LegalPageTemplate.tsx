import { useEffect } from 'react'
import type { LegalDocument } from '../../types/legal'
import { PageTemplate } from './PageTemplate'
import { LegalLinks } from '../molecules/LegalLinks'

type LegalPageTemplateProps = {
  document: LegalDocument
}

export function LegalPageTemplate({ document: doc }: LegalPageTemplateProps) {
  useEffect(() => {
    const previous = window.document.title
    window.document.title = `${doc.title} | Conecta Sênior`
    return () => {
      window.document.title = previous
    }
  }, [doc.title])

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  return (
    <PageTemplate>
      <article className="space-y-10 text-slate-800">
        <header className="space-y-4">
          <p className="text-lg font-semibold uppercase tracking-wider text-primary">Conecta Sênior</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">{doc.title}</h1>
          <p className="text-xl md:text-2xl leading-relaxed text-slate-700">{doc.summary}</p>
          <p className="text-lg text-slate-600">Última atualização: {doc.updatedAt}</p>
        </header>

        <nav aria-label="Seções" className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Nesta página</h2>
          <ol className="list-decimal pl-6 space-y-1 text-lg">
            {doc.sections.map((section, i) => (
              <li key={section.title}>
                <a href={`#secao-${i + 1}`} className="underline underline-offset-4 hover:text-primary inline-block py-1">
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section, i) => (
          <section key={section.title} id={`secao-${i + 1}`} className="space-y-4 scroll-mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              {i + 1}. {section.title}
            </h2>
            {section.paragraphs?.map(p => (
              <p key={p} className="text-xl leading-relaxed">{p}</p>
            ))}
            {section.items && (
              <ul className="list-disc pl-7 space-y-3 text-xl leading-relaxed">
                {section.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <footer className="pt-6 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            className="min-h-[56px] px-6 rounded-xl border-2 border-slate-300 text-xl font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
          >
            ← Voltar
          </button>
          <LegalLinks />
        </footer>
      </article>
    </PageTemplate>
  )
}
