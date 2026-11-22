# API.md - Registro de endpoints

Modelo de registro:
- Nome
- Uso
- Entrada
- Saída
- Status: existente / novo

## Autenticação

### POST /users/register
- Uso: Cadastro de usuário candidato 60+
- Entrada: `{ email: string, password: string }`
- Saída: `{ message: "registered, confirmation email sent" }`
- Status: existente

### POST /users/login
- Uso: Login com e-mail e senha
- Entrada: `{ email: string, password: string }`
- Saída: `{ message, user_id, token }`
- Status: existente

### GET /users/confirm?token=...
- Uso: Confirmação de e-mail, gera JWT de sessão
- Entrada: query token
- Saída: `{ message: "confirmed", user_id, token }`
- Status: existente

## Perfis

### GET /profiles/me
- Uso: Perfil próprio do usuário autenticado
- Entrada: Bearer token
- Saída: `{ user_id }`
- Status: existente

### POST /profiles
- Uso: Criar perfil para usuário
- Entrada: `{ user_id: string }`
- Saída: `{ id }`
- Status: existente

## Currículos

### POST /profiles/:profileID/resumes
- Uso: Upload PDF de currículo, extrai texto, estrutura e gera embedding
- Entrada: multipart/form-data file
- Saída: `{ id, parsed, resume }`
- Status: existente

## Vagas

### GET /jobs
- Uso: Listar vagas abertas
- Entrada: Bearer token
- Saída: `{ jobs: [...] }`
- Status: existente

### POST /jobs
- Uso: Criar vaga com embedding
- Entrada: `{ title, description, company_id }`
- Saída: `{ id }`
- Status: existente

## Empresas

### POST /companies
- Uso: Criar empresa vinculada ao usuário autenticado
- Entrada: `{ name }`
- Saída: `{ id }`
- Status: existente

## Matching

### GET /match/:resume_id
- Uso: Matching vetorial entre currículo e vagas
- Entrada: Bearer token, resume_id path
- Saída: `{ resume_id, matches: [{ job_id, score, percent }] }`
- Status: existente

### GET /match/ranking
- Uso: Ranking de melhores matches para todos os currículos
- Entrada: Bearer token
- Saída: `{ ranking: [{ resume_id, best_job_id, score, percent }] }`
- Status: existente

## Observações

- Todos os endpoints protegidos exigem Bearer token via middleware AuthRequired.
- Backend usa JWT com expiração 24h.
- Confirmação de e-mail envia link para https://senior-conecta.zoryuz.com/confirm?token=...
