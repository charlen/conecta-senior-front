import { Button } from '../components/atoms/Button'
import { Input } from '../components/atoms/Input'
import { Label } from '../components/atoms/Label'
import { Text } from '../components/atoms/Text'
import { Heading } from '../components/atoms/Heading'
import { Icon } from '../components/atoms/Icon'
import { Spinner } from '../components/atoms/Spinner'
import { CartaoOpcao } from '../components/molecules/CartaoOpcao'
import { BarraProgresso } from '../components/molecules/BarraProgresso'
import { Alerta } from '../components/molecules/Alerta'
import { BotaoOuvir } from '../components/molecules/BotaoOuvir'
import { CampoComVoz } from '../components/molecules/CampoComVoz'

export default function DevComponentes() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-12">
      <Heading>Catálogo de Componentes</Heading>

      <section>
        <Heading>Atoms</Heading>
        <div className="space-y-6">
          <div>
            <Text>Botão</Text>
            <div className="flex gap-4 mt-2">
              <Button variant="primary">Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="danger">Perigo</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="demo">Input</Label>
            <Input id="demo" placeholder="Digite aqui" />
          </div>
          <div className="flex items-center gap-4">
            <Icon name="★" size={32} />
            <Spinner />
          </div>
        </div>
      </section>

      <section>
        <Heading>Molecules</Heading>
        <div className="space-y-6">
          <CartaoOpcao titulo="Enviar currículo" descricao="Faça upload do seu PDF" selecionado />
          <BarraProgresso passoAtual={2} totalPassos={5} />
          <Alerta tipo="sucesso" titulo="Sucesso">Operação concluída com sucesso.</Alerta>
          <BotaoOuvir />
          <CampoComVoz id="voz" label="Fale sua resposta" value="" onChange={() => {}} />
        </div>
      </section>
    </div>
  )
}
