type BarraProgressoProps = {
  passoAtual: number
  totalPassos: number
}

export function BarraProgresso({ passoAtual, totalPassos }: BarraProgressoProps) {
  const percentual = Math.round((passoAtual / totalPassos) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between text-lg text-text-secondary mb-2">
        <span>Passo {passoAtual} de {totalPassos}</span>
        <span>{percentual}%</span>
      </div>
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percentual}%` }}
          aria-valuenow={percentual}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  )
}
