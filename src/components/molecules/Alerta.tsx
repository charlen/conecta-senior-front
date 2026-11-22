type AlertaProps = {
  tipo?: 'sucesso' | 'erro' | 'info'
  titulo?: string
  children: React.ReactNode
}

export function Alerta({ tipo = 'info', titulo, children }: AlertaProps) {
  const bg =
    tipo === 'sucesso' ? 'bg-success/10 border-success' :
    tipo === 'erro' ? 'bg-error/10 border-error' :
    'bg-primary/10 border-primary'
  return (
    <div className={`border-l-4 p-4 rounded-lg ${bg}`}>
      {titulo && <div className="font-semibold text-lg mb-1">{titulo}</div>}
      <div className="text-lg text-text-primary">{children}</div>
    </div>
  )
}
