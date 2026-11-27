# PLANO.md: Portal de oportunidades para pessoas 60+

> Leia este arquivo inteiro antes de qualquer tarefa. Execute **uma tarefa por vez**, na ordem. Ao terminar, pare e aguarde a próxima instrução.

## 1. Contexto

Portal web com dois públicos:

- **Seniores (60+):** se cadastram, informam sua experiência (enviando PDF, preenchendo manualmente ou respondendo por voz) e veem vagas compatíveis com seu perfil, podendo se candidatar.
- **Empresas/recrutadores:** se cadastram, publicam vagas e buscam candidatos por percentual de similaridade.

O **backend (Go) já existe e funciona**: cadastro, e-mail de confirmação com link/JWT, parse de PDF, geração de resumo, embeddings em pgvector (Postgres) e busca por similaridade. Este plano cobre principalmente o **frontend** e os ajustes pontuais de backend que ele exigir.

## 2. Stack e convenções

- Frontend: **React + TypeScript + Tailwind CSS**, organizado em **Atomic Design**.
- Backend: **Go** (já existente).
- Usuários seniores são o público prioritário: acessibilidade e simplicidade vencem qualquer outra decisão de design.

### Estrutura de pastas do frontend (atomic design)

```
src/
  components/
    atoms/        # Botao, Input, Label, Icone, Texto, Titulo, Spinner...
    molecules/    # CampoComVoz, CampoFormulario, CartaoOpcao, BarraProgresso, Alerta...
    organisms/    # FormularioCadastro, CartaoVaga, ListaVagas, ResumoPerfil, CabecalhoApp...
    templates/    # LayoutPublico, LayoutOnboarding, LayoutSenior, LayoutEmpresa
  pages/          # Uma pasta por página, apenas compõe templates + organisms
  routes/         # Definição de rotas e guards
  services/       # Cliente HTTP e funções de acesso à API
  hooks/          # useAuth, useVoz, useRascunhoPerfil...
  types/          # Tipos TypeScript compartilhados
  mocks/          # Dados falsos para desenvolvimento das telas
docs/
  PLANO.md
  DESIGN.md       # Tokens e regras visuais (criar na Tarefa 0)
  API.md          # Lista viva das chamadas de API usadas (criar na Tarefa 0)
```

Regras do atomic design:

- Atoms não conhecem API nem regras de negócio.
- Molecules combinam atoms e podem ter estado local simples.
- Organisms podem usar hooks e receber dados por props; não chamam a API diretamente quando for evitável (prefira hooks em `hooks/`).
- Pages só compõem e conectam dados.

## 3. Regras de trabalho para o agente (importante)

### Sobre a API

1. **Antes de criar qualquer chamada de API, inspecione o backend** (rotas, handlers, DTOs) e **use o que já existe**.
2. Só **crie ou altere um endpoint se realmente faltar**. Nesse caso: implemente de forma mínima em Go, siga o padrão de rotas, handlers, validação e erros já usado no projeto, e **registre a mudança em `docs/API.md`** (o que faz, entrada, saída).
3. Nunca invente um endpoint no frontend e assuma que existe. Se não tiver certeza, procure no código e, em último caso, pergunte.
4. Mantenha em `docs/API.md` a lista do que cada tela consome.
5. Toda chamada passa por `services/`, nunca direto dentro de componentes.

### Sobre o código

6. Uma tarefa por vez. Não refatore o que não foi pedido.
7. TypeScript estrito: sem `any`. Tipos em `types/`.
8. Todos os textos visíveis em **português do Brasil**, linguagem simples.
9. Toda tela nova começa com **dados mockados** (`mocks/`); só depois conecte à API real.
10. Reutilize componentes existentes antes de criar novos. Se criar, coloque no nível correto do atomic design.
11. Se faltar informação, **pergunte antes de supor**.
12. Ao final de cada tarefa, informe: arquivos criados/alterados, endpoints usados ou criados, e como validar manualmente. Sugira uma mensagem de commit.

## 4. Princípios de UX para 60+ (valem para TODAS as telas)

- **Uma pergunta por tela** nos fluxos de cadastro, com botões grandes "Continuar" e "Voltar" sempre visíveis.
- Fonte base de **18 a 20px**, bom contraste (mínimo WCAG AA), espaçamento generoso.
- Alvos de toque/clique de **no mínimo 48x48px**.
- Ícones **sempre acompanhados de texto**.
- Linguagem simples, sem jargão ("Experiência", não "Skills"; "Currículo", não "Perfil profissional").
- **Sem senha**: acesso por link enviado por e-mail (já existe o envio; ver Tarefa 2).
- **Salvamento automático** a cada passo; a pessoa pode fechar e voltar de onde parou.
- Toda tela tem: botão de **ajuda**, botão de **ouvir a pergunta** (TTS) e, nos campos de texto, opção de **falar** (STT).
- Mensagens de erro dizem **o que fazer**, não só o que deu errado.
- Confirmação clara antes de ações importantes (ex.: candidatar-se).
- Navegação completa por teclado, foco visível, labels corretos para leitor de tela.
- Evitar tempo limite curto, animações rápidas e textos pequenos em cinza claro.

## 5. Mapa de páginas e fluxos

### 5.1 Sênior

**Entrada e acesso**

| Rota | Objetivo |
|---|---|
| `/` | Landing: o que é o portal, dois botões grandes ("Quero me cadastrar", "Já tenho cadastro") |
| `/cadastro` | Nome, e-mail, aceite de termos e privacidade (LGPD) em linguagem clara |
| `/confira-seu-email` | Instrução simples e botão "Reenviar e-mail" |
| `/verificar` | Recebe o token do link, conclui a sessão e redireciona conforme o estado do usuário |
| `/entrar` | Pede só o e-mail e envia novo link de acesso |

**Onboarding (após confirmar e-mail)**

| Rota | Objetivo |
|---|---|
| `/comecar/metodo` | "Como você prefere preencher?": 3 cartões grandes (Enviar currículo em PDF / Preencher digitando / Responder falando) |
| `/comecar/curriculo` | Upload do PDF e tela "Lendo seu currículo..." |
| `/comecar/passo/:n` | Wizard manual, um passo por tela, com barra "Passo X de Y" |
| `/comecar/voz` | Mesmas perguntas do wizard, respondidas por voz |
| `/comecar/revisao` | Resumo por seções com botão "Editar" em cada uma; ao confirmar, finaliza o perfil |
| `/comecar/pronto` | Comemoração curta e botão "Ver vagas para mim" |

**Os três caminhos convergem na mesma tela de revisão** e usam o mesmo modelo de dados do perfil.

**Etapas do wizard manual e da voz (mesmas perguntas)**

1. Dados básicos (cidade, telefone)
2. O que você já fez (experiências, uma por vez, com "Adicionar outra")
3. Formação
4. O que você sabe fazer (habilidades, com sugestões clicáveis)
5. O que você procura (tipo de vaga, presencial/remoto, meio período/integral, disponibilidade)
6. Sobre você (texto livre curto, opcional)
7. Revisão

**Área logada**

| Rota | Objetivo |
|---|---|
| `/vagas` | Vagas compatíveis ordenadas por similaridade, com rótulo textual ("Muito compatível", "Compatível") e um "por que combina" curto |
| `/vagas/:id` | Detalhes da vaga e botão grande "Quero me candidatar" com confirmação |
| `/candidaturas` | Vagas em que se candidatou e status |
| `/meu-perfil` | Edição do perfil (reaproveita os componentes do wizard) |
| `/ajuda` | Perguntas frequentes e contato |

### 5.2 Empresa / recrutador

| Rota | Objetivo |
|---|---|
| `/empresas` | Landing para recrutadores |
| `/empresas/cadastro` | Dados da empresa, CNPJ, contato do recrutador, confirmação por e-mail |
| `/empresa/painel` | Resumo: vagas abertas, candidaturas novas |
| `/empresa/vagas` | Lista de vagas com status (aberta, pausada, encerrada) |
| `/empresa/vagas/nova` e `/empresa/vagas/:id/editar` | Cadastro/edição de vaga (título, descrição, requisitos, local, modalidade, carga horária) |
| `/empresa/vagas/:id/candidatos` | "Quem se candidatou" e "Sugeridos pelo sistema", ordenados por similaridade |
| `/empresa/buscar` | Busca livre de candidatos com filtros (cidade, disponibilidade, modalidade) e controle de percentual mínimo de similaridade |
| `/empresa/candidatos/:id` | Perfil do candidato e ação "Demonstrar interesse" |

> Privacidade (LGPD): por padrão, **dados de contato do sênior ficam ocultos** para a empresa até que o sênior aceite o contato. Se o backend atual já tratar isso de outra forma, siga o backend e avise.

## 6. Regras de estado e redirecionamento (ponto crítico)

O principal problema atual é o que acontece **depois** do link do e-mail. Resolver assim:

1. A página `/verificar` lê o token da URL, entrega ao backend usando o fluxo já existente (inspecione o que o backend já faz com o JWT recebido) e **estabelece a sessão** do usuário.
2. O token do e-mail deve ser de **uso único e curto**; o da sessão é outro. Se o backend hoje usa o mesmo token para as duas coisas, ajuste o mínimo necessário e documente.
3. Se o token for inválido ou expirado: tela amigável com botão "Enviar novo link".
4. O usuário precisa ter um **estado de progresso** (ex.: e-mail confirmado, método escolhido, perfil em revisão, completo) e um **papel** (sênior ou empresa). Se o backend ainda não expõe isso, adicione de forma mínima.
5. Um **guard de rotas** no frontend lê papel e progresso e leva a pessoa para a tela correta:
   - não autenticado → `/entrar`
   - sênior com perfil incompleto → etapa em que parou
   - sênior com perfil completo → `/vagas`
   - empresa → `/empresa/painel` (ou conclusão do cadastro da empresa, se incompleto)
6. Nunca deixar a pessoa em tela em branco: todo estado tem um destino definido.

## 7. Tarefas (executar na ordem)

Cada tarefa deve terminar com os critérios de pronto atendidos. Depois de cada uma, pare.

### Tarefa 0: Fundação e documentação
- Criar `docs/DESIGN.md` com tokens: paleta (alto contraste), escala tipográfica (base 18-20px), espaçamentos, raios, tamanho mínimo de alvo, estados de foco. Configurar esses tokens no Tailwind.
- Criar `docs/API.md` vazio com o modelo de registro (nome, uso, entrada, saída, status: existente/novo).
- Inspecionar o backend e listar em `docs/API.md` tudo o que **já existe** e é útil para este plano.
- Criar a estrutura de pastas do atomic design.
- **Pronto quando:** estrutura criada, tokens no Tailwind, `API.md` reflete o backend real.

### Tarefa 1: Atoms e molecules base
- Atoms: Botao (variantes primário, secundário, perigo; tamanho grande), Input, Label, Texto, Titulo, Icone, Spinner.
- Molecules: CampoFormulario (label + input + erro + ajuda), CartaoOpcao (cartão grande selecionável), BarraProgresso ("Passo X de Y"), Alerta (sucesso/erro/info), BotaoOuvir (TTS), CampoComVoz (campo + botão de falar).
- Uma página interna de catálogo (ex.: `/dev/componentes`) para visualizar tudo.
- **Pronto quando:** todos os componentes respeitam o `DESIGN.md`, funcionam só com teclado e têm foco visível. Vozes ainda podem ser simuladas.

### Tarefa 2: Autenticação, verificação e guard de rotas
- Páginas: landing, `/cadastro`, `/confira-seu-email`, `/entrar`, `/verificar`.
- Hook `useAuth` e guard de rotas conforme a seção 6.
- Tratar token expirado/inválido com tela amigável.
- **Pronto quando:** fluxo completo cadastro → e-mail → link → sessão → redirecionamento correto funciona de ponta a ponta com o backend real, e recarregar a página mantém a sessão.

### Tarefa 3: Escolha do método e modelo de perfil
- Definir os tipos TypeScript do perfil (dados básicos, experiências, formação, habilidades, preferências, sobre mim) alinhados ao que o backend já aceita.
- Hook de rascunho (`useRascunhoPerfil`) com salvamento automático a cada passo.
- Página `/comecar/metodo` com os três cartões.
- **Pronto quando:** escolher um método registra o progresso e fechar/reabrir o navegador devolve a pessoa ao ponto certo.

### Tarefa 4: Wizard manual
- Uma tela por etapa (seção 5.1), com barra de progresso, Voltar/Continuar, validação gentil e "Adicionar outra" nas experiências e formação.
- Etapas como organisms reutilizáveis (serão usados também no `/meu-perfil` e na voz).
- **Pronto quando:** preencher todas as etapas leva à revisão com tudo salvo; sair no meio e voltar mantém os dados.

### Tarefa 5: Envio de currículo em PDF
- `/comecar/curriculo`: upload com arrastar ou escolher arquivo, validação de tipo e tamanho, tela de progresso "Lendo seu currículo...".
- Usar o parse de PDF existente; ao concluir, preencher o rascunho e ir para a revisão.
- Tratar falha de leitura com opção de "Preencher digitando".
- **Pronto quando:** um PDF real preenche o rascunho e a revisão mostra os campos extraídos editáveis.

### Tarefa 6: Preenchimento por voz
- Antes de começar, **pergunte** como TTS e STT são expostos (backend ou navegador, streaming ou gravar e enviar) e inspecione o que existe.
- Hook `useVoz` (ouvir pergunta, gravar resposta, transcrever, estados de erro/permissão do microfone).
- `/comecar/voz`: lê a pergunta, transcreve a resposta, mostra o texto e pergunta "Está certo?" (Sim / Quero corrigir). Reaproveitar as mesmas etapas e o mesmo modelo do wizard.
- Sempre disponível: "Prefiro digitar".
- Ativar o `CampoComVoz` e o `BotaoOuvir` reais nos demais campos.
- **Pronto quando:** é possível completar todo o cadastro só falando e confirmando, e há saída para o teclado em qualquer ponto.

### Tarefa 7: Revisão e conclusão do perfil
- `/comecar/revisao`: resumo legível por seções, "Editar" leva à etapa correspondente e volta à revisão.
- Ao confirmar, acionar a finalização do perfil usando o fluxo existente (resumo + embedding), com estado de carregamento e tratamento de erro.
- `/comecar/pronto` com botão "Ver vagas para mim".
- **Pronto quando:** confirmar gera o perfil pesquisável e atualiza o progresso do usuário para completo.

### Tarefa 8: Vagas compatíveis (sênior)
- `/vagas`: CartaoVaga com título, empresa, local, modalidade, rótulo de compatibilidade (texto, não só número) e "por que combina". Estados de carregando, vazio ("ainda não encontramos vagas, voltaremos a avisar") e erro.
- `/vagas/:id` com botão "Quero me candidatar" e diálogo de confirmação.
- `/candidaturas` com status.
- Definir faixas de compatibilidade (ex.: muito compatível, compatível, pouco compatível) com base nos percentuais retornados e documentá-las.
- **Pronto quando:** o sênior vê vagas ordenadas, abre detalhes, candidata-se e acompanha o status.

### Tarefa 9: Meu perfil e ajuda
- `/meu-perfil` reaproveitando os organisms do wizard; ao salvar, o perfil é reprocessado para atualizar o match.
- `/ajuda` com FAQ e contato.
- **Pronto quando:** editar o perfil altera as vagas sugeridas.

### Tarefa 10: Cadastro e acesso da empresa
- `/empresas`, `/empresas/cadastro` (dados da empresa, CNPJ, contato do recrutador) reutilizando o fluxo de confirmação por e-mail.
- Guard de rotas com papel "empresa".
- **Pronto quando:** recrutador se cadastra, confirma e cai em `/empresa/painel`.

### Tarefa 11: Gestão de vagas
- `/empresa/vagas`, criação e edição de vaga, mudança de status (aberta/pausada/encerrada).
- Ao salvar, a vaga precisa ter embedding gerado/atualizado (usar o que existe ou criar o necessário).
- **Pronto quando:** vaga criada aparece nas buscas de match dos seniores.

### Tarefa 12: Candidatos e busca por similaridade (empresa)
- `/empresa/vagas/:id/candidatos`: "Quem se candidatou" e "Sugeridos pelo sistema", ordenados por similaridade.
- `/empresa/buscar`: busca por texto com filtros e controle de percentual mínimo.
- `/empresa/candidatos/:id` com perfil e "Demonstrar interesse", respeitando a regra de privacidade da seção 5.2.
- `/empresa/painel` com resumos.
- **Pronto quando:** a empresa encontra candidatos por similaridade e registra interesse.

### Tarefa 13: Acabamento e acessibilidade
- Revisão de todas as telas: contraste, foco, tamanhos, leitor de tela, navegação por teclado, textos claros.
- Estados de erro, vazio e carregando em todas as páginas.
- Responsividade (celular e tablet têm prioridade; muitos seniores usam celular).
- README com como rodar o projeto.
- **Pronto quando:** checklist da seção 8 passa em todas as telas.

## 8. Checklist de aceite (para toda tela)

- [ ] Funciona só com teclado, com foco visível
- [ ] Textos em português simples, sem jargão
- [ ] Fonte base de 18px ou mais e alvos de 48px ou mais
- [ ] Contraste adequado
- [ ] Botão de ajuda e de ouvir a pergunta presentes (nas telas de fluxo)
- [ ] Estados de carregando, vazio e erro tratados
- [ ] Nenhum `any` e nenhuma chamada de API fora de `services/`
- [ ] Endpoints usados registrados em `docs/API.md`
- [ ] Componentes no nível correto do atomic design

## 9. Perguntas em aberto (o agente deve perguntar, não supor)

- Como TTS/STT são acessados (backend ou navegador; streaming ou arquivo)?
- Um sênior tem apenas um perfil? Uma empresa pode ter vários recrutadores?
- A empresa vê dados de contato diretamente ou só após aceite do sênior?
- Existe limite de tamanho para o PDF enviado?
- Qual biblioteca de roteamento e de requisições o projeto já usa?