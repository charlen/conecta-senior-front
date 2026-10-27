import { ReactNode } from 'react'

export function PageTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto my-12 p-10 bg-white rounded-3xl border border-slate-200 shadow-xl">
        {children}
      </div>
    </div>
  )
}
