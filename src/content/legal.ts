import type { LegalDocument } from '../types/legal'

export const LEGAL_CONTACT_EMAIL = 'privacidade@zoryuz.com'
export const LEGAL_UPDATED_AT = '26 de novembro de 2026'

export const privacyPolicy: LegalDocument = {
  title: 'Política de Privacidade',
  summary:
    'Explicamos aqui, em linguagem simples, quais dados pedimos, por que pedimos e como você pode consultar, corrigir ou apagar suas informações a qualquer momento.',
  updatedAt: LEGAL_UPDATED_AT,
  sections: [
    {
      title: 'Quem somos',
      paragraphs: [
        'O Conecta Sênior é uma plataforma da Zoryuz que aproxima profissionais com 60 anos ou mais de empresas com vagas de trabalho.',
        'A Zoryuz é a responsável (controladora) pelos dados pessoais tratados na plataforma, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD).'
      ]
    },
    {
      title: 'Quais dados coletamos',
      items: [
        'Dados de cadastro: e-mail, senha (se você escolher usar uma) e tipo de conta (candidato ou empresa).',
        'Dados do perfil: nome, ano de nascimento, cidade, estado, telefone e um texto sobre você.',
        'Experiência profissional: currículo em PDF que você enviar, ou as respostas que você digitar ou falar.',
        'Gravações de voz: somente quando você usa o botão de falar, para transformar sua fala em texto.',
        'Dados das empresas: nome da empresa, CNPJ, site e as vagas publicadas.',
        'Dados técnicos mínimos: registros de acesso e erros, usados para manter o serviço seguro e funcionando.'
      ]
    },
    {
      title: 'Para que usamos seus dados',
      items: [
        'Criar e proteger sua conta, inclusive enviando códigos de acesso por e-mail.',
        'Montar seu perfil profissional a partir do currículo, das respostas digitadas ou da sua voz.',
        'Indicar vagas compatíveis com sua experiência, usando cálculo de semelhança entre o seu perfil e as vagas.',
        'Permitir que empresas encontrem candidatos com perfil adequado às vagas que publicaram.',
        'Cumprir obrigações legais e responder a solicitações de autoridades, quando exigido por lei.'
      ]
    },
    {
      title: 'Bases legais',
      paragraphs: [
        'Tratamos seus dados para executar o serviço que você pediu ao se cadastrar (art. 7º, V da LGPD), com o seu consentimento para o uso de currículo e voz (art. 7º, I), para cumprir obrigações legais (art. 7º, II) e, de forma limitada, por legítimo interesse na segurança da plataforma (art. 7º, IX).'
      ]
    },
    {
      title: 'Uso de inteligência artificial',
      paragraphs: [
        'Usamos inteligência artificial para ler o seu currículo, organizar sua experiência, transformar voz em texto e calcular a compatibilidade com as vagas. Esses resultados são sugestões: você pode revisar e corrigir tudo antes de concluir o perfil.',
        'Não usamos seus dados para fazer propaganda nem vendemos seus dados a ninguém.'
      ]
    },
    {
      title: 'Com quem compartilhamos',
      items: [
        'Empresas cadastradas: veem o seu perfil profissional quando ele é compatível com uma vaga.',
        'Provedores de infraestrutura que nos ajudam a operar o serviço, como hospedagem, rede de distribuição e envio de e-mails (por exemplo, Amazon Web Services e Cloudflare). Eles só podem usar os dados para prestar esse serviço.',
        'Autoridades públicas, somente quando houver obrigação legal.'
      ]
    },
    {
      title: 'E-mails que enviamos',
      paragraphs: [
        'Enviamos apenas e-mails necessários para usar a plataforma, como códigos de confirmação e de acesso. Não enviamos propaganda.'
      ]
    },
    {
      title: 'Por quanto tempo guardamos',
      paragraphs: [
        'Guardamos seus dados enquanto sua conta estiver ativa. Quando você pedir a exclusão, apagamos ou tornamos anônimos os dados em até 30 dias, exceto o que a lei nos obrigar a manter.',
        'Gravações de voz são usadas apenas para gerar o texto e não ficam armazenadas depois disso.'
      ]
    },
    {
      title: 'Seus direitos',
      paragraphs: ['A qualquer momento, você pode pedir para:'],
      items: [
        'Confirmar se tratamos seus dados e receber uma cópia deles.',
        'Corrigir dados incompletos ou errados.',
        'Apagar sua conta e seus dados.',
        'Retirar o consentimento para o uso de currículo e voz.',
        'Saber com quem seus dados foram compartilhados.'
      ]
    },
    {
      title: 'Segurança',
      paragraphs: [
        'Usamos conexão segura (HTTPS), acesso por código enviado ao seu e-mail e controle de acesso aos servidores. Nenhum sistema é totalmente imune a falhas; se acontecer um incidente que possa trazer risco a você, vamos avisar você e a Autoridade Nacional de Proteção de Dados (ANPD).'
      ]
    },
    {
      title: 'Armazenamento no seu navegador',
      paragraphs: [
        'Guardamos no seu navegador apenas o necessário para manter você conectado e salvar o rascunho do seu perfil enquanto você preenche. Não usamos cookies de propaganda.'
      ]
    },
    {
      title: 'Fale conosco',
      paragraphs: [
        `Para exercer seus direitos ou tirar dúvidas sobre privacidade, escreva para ${LEGAL_CONTACT_EMAIL}. Respondemos em até 15 dias.`,
        'Se não ficar satisfeito com a resposta, você também pode procurar a ANPD.'
      ]
    }
  ]
}

export const termsOfUse: LegalDocument = {
  title: 'Termos de Uso',
  summary:
    'Estas são as regras para usar o Conecta Sênior. Ao criar sua conta, você concorda com elas.',
  updatedAt: LEGAL_UPDATED_AT,
  sections: [
    {
      title: 'O que é o Conecta Sênior',
      paragraphs: [
        'O Conecta Sênior é uma plataforma gratuita para candidatos, mantida pela Zoryuz, que ajuda profissionais com 60 anos ou mais a encontrar vagas compatíveis com sua experiência e ajuda empresas a encontrar esses profissionais.'
      ]
    },
    {
      title: 'Quem pode usar',
      items: [
        'Pessoas maiores de 18 anos que busquem oportunidades de trabalho.',
        'Empresas e recrutadores que queiram publicar vagas reais.'
      ]
    },
    {
      title: 'Sua conta',
      items: [
        'Use um e-mail que seja seu. É por ele que você recebe os códigos de acesso.',
        'Não compartilhe seus códigos de acesso nem sua senha com ninguém.',
        'Você é responsável pelas informações que coloca no seu perfil. Elas devem ser verdadeiras.'
      ]
    },
    {
      title: 'Compromissos das empresas',
      items: [
        'Publicar somente vagas reais, com descrição clara e honesta.',
        'Não discriminar candidatos por idade, gênero, raça, deficiência ou qualquer outro motivo proibido por lei.',
        'Usar os dados dos candidatos apenas para o processo seletivo da vaga publicada.',
        'Nunca cobrar qualquer valor dos candidatos.'
      ]
    },
    {
      title: 'O que não é permitido',
      items: [
        'Publicar vagas falsas, golpes ou ofertas que peçam pagamento ao candidato.',
        'Usar a plataforma para enviar propaganda ou mensagens não solicitadas.',
        'Copiar dados de outros usuários ou tentar acessar contas que não são suas.',
        'Tentar prejudicar o funcionamento da plataforma.'
      ]
    },
    {
      title: 'Sobre as indicações de vagas',
      paragraphs: [
        'A compatibilidade entre perfis e vagas é calculada automaticamente e serve como orientação. A plataforma não garante contratação: a decisão final é sempre da empresa e do candidato.'
      ]
    },
    {
      title: 'Suspensão e encerramento',
      paragraphs: [
        'Você pode encerrar sua conta quando quiser. Podemos suspender contas que descumpram estes termos, especialmente em casos de vagas falsas ou tentativa de golpe.'
      ]
    },
    {
      title: 'Privacidade',
      paragraphs: [
        'O uso dos seus dados é explicado na nossa Política de Privacidade, que faz parte destes termos.'
      ]
    },
    {
      title: 'Mudanças nestes termos',
      paragraphs: [
        'Se mudarmos estes termos de forma importante, avisaremos na plataforma ou por e-mail antes de a mudança valer.'
      ]
    },
    {
      title: 'Lei aplicável e contato',
      paragraphs: [
        'Estes termos seguem as leis do Brasil.',
        `Dúvidas? Escreva para ${LEGAL_CONTACT_EMAIL}.`
      ]
    }
  ]
}
