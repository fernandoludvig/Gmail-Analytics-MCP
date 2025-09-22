# Gmail Analytics MCP

Um aplicativo web moderno para análise de e-mails do Gmail usando Next.js 14, React, ShadCN UI e MCPs (Model Control Points) do Smithery.ai para simplificar a autenticação e acesso à API do Gmail.

## 🚀 Funcionalidades

- **Autenticação Simplificada**: Login com Google usando MCPs do Smithery.ai
- **Análise Inteligente**: Top 10 destinatários e remetentes dos últimos 12 meses
- **Interface Moderna**: Dashboard responsivo com gráficos e tabelas interativas
- **Integração MCP**: Simplificação da autenticação OAuth2 via Smithery.ai
- **Fallback Robusto**: Suporte à Gmail API tradicional quando MCP não disponível
- **Dados Seguros**: Armazenamento temporário de tokens com aviso de privacidade

## 🛠️ Tecnologias

- **Next.js 14** (App Router)
- **React 18** com TypeScript
- **ShadCN UI** para componentes
- **Tailwind CSS** para estilização
- **Recharts** para gráficos
- **Google APIs** para integração Gmail
- **Smithery.ai MCPs** para autenticação simplificada

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Google com Gmail
- Credenciais OAuth2 do Google Cloud Console

## ⚡ Instalação Rápida

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd gmail-analytics-mcp
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env.local
   ```

4. **Configure as credenciais do Google**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto
   - Ative a Gmail API
   - Vá em "Credenciais" > "Criar credenciais" > "ID do cliente OAuth 2.0"
   - Configure URIs de redirecionamento: `http://localhost:3000/api/auth/callback/google`
   - Copie CLIENT_ID e CLIENT_SECRET para `.env.local`

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

6. **Acesse o aplicativo**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔧 Configuração Detalhada

### Variáveis de Ambiente (.env.local)

```env
# Google OAuth Credentials (Obrigatório)
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui

# Smithery.ai MCP Configuration (Opcional)
SMITHERY_API_KEY=sua_api_key_smithery_aqui
SMITHERY_BASE_URL=https://api.smithery.ai
```

### Configuração do Google Cloud Console

1. **Criar Projeto**
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Clique em "Criar Projeto"
   - Digite um nome para o projeto
   - Clique em "Criar"

2. **Ativar Gmail API**
   - No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
   - Busque por "Gmail API"
   - Clique em "Ativar"

3. **Criar Credenciais OAuth2**
   - Vá em "APIs e Serviços" > "Credenciais"
   - Clique em "Criar credenciais" > "ID do cliente OAuth 2.0"
   - Selecione "Aplicativo da Web"
   - Configure URIs de redirecionamento:
     - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/callback/google` (produção)
   - Copie o CLIENT_ID e CLIENT_SECRET

## 🏗️ Estrutura do Projeto

```
gmail-analytics-mcp/
├── app/
│   ├── api/
│   │   ├── auth/callback/google/route.ts    # Callback OAuth
│   │   ├── gmail/analytics/route.ts         # API Analytics
│   │   └── smithery/
│   │       ├── auth/route.ts                # Autenticação MCP
│   │       └── status/route.ts              # Status MCP
│   ├── globals.css                          # Estilos globais
│   ├── layout.tsx                           # Layout raiz
│   └── page.tsx                             # Página principal
├── components/
│   ├── ui/                                  # Componentes ShadCN UI
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   ├── EmailAnalytics.tsx                   # Componente de analytics
│   └── GmailAuthMCP.tsx                     # Componente de autenticação
├── lib/
│   ├── gmail.ts                             # Cliente Gmail API (fallback)
│   ├── smithery.ts                          # Cliente MCP Smithery
│   └── utils.ts                             # Utilitários
├── types/
│   └── index.ts                             # Definições TypeScript
└── README.md
```

## 🔄 Como Funciona

### 1. Autenticação via MCP Smithery.ai

O aplicativo tenta usar MCPs do Smithery.ai primeiro:

```typescript
// lib/smithery.ts
const response = await smitheryClient.authenticateWithGoogle(clientId, clientSecret);
```

**Vantagens do MCP:**
- ✅ Autenticação OAuth2 simplificada
- ✅ Gerenciamento automático de tokens
- ✅ Chamadas API seguras (sem CORS)
- ✅ Refresh automático de tokens

### 2. Fallback para Gmail API

Se MCP não estiver disponível, usa Gmail API tradicional:

```typescript
// lib/gmail.ts
const tokens = await gmailClient.getTokens(code);
const analytics = await gmailClient.getEmailAnalytics();
```

### 3. Análise de E-mails

- **E-mails Enviados**: Query `label:SENT` dos últimos 12 meses
- **E-mails Recebidos**: Query `label:INBOX -label:SPAM` dos últimos 12 meses
- **Processamento**: Extração de headers 'To' e 'From'
- **Ranking**: Contagem e ordenação dos top 10

## 📊 Interface

### Dashboard Principal
- **Header**: Título e descrição do aplicativo
- **Painel de Autenticação**: Login/logout com status MCP
- **Tabs de Analytics**: Alternar entre enviados e recebidos
- **Gráficos**: Barras horizontais com Recharts
- **Tabelas**: Ranking detalhado com contagens

### Componentes Principais

#### GmailAuthMCP
- Botão de login/logout
- Status da integração MCP
- Informações do usuário autenticado

#### EmailAnalytics
- Gráfico de barras horizontais
- Tabela de ranking
- Loading states com skeletons
- Tooltips informativos

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel**
2. **Configure as variáveis de ambiente**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SMITHERY_API_KEY` (opcional)
3. **Atualize URIs de redirecionamento** no Google Cloud Console
4. **Deploy automático**

### Outras Plataformas

O aplicativo é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Segurança

- **OAuth2**: Autenticação segura via Google
- **Tokens Temporários**: Armazenamento em cookies/sessão
- **HTTPS**: Obrigatório em produção
- **Escopo Limitado**: Apenas leitura de e-mails (`gmail.readonly`)
- **Aviso de Privacidade**: Informações sobre uso de dados

## 🐛 Troubleshooting

### Erro: "Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão definidas corretamente
- Reinicie o servidor de desenvolvimento

### Erro: "redirect_uri_mismatch"
- Verifique as URIs de redirecionamento no Google Cloud Console
- Certifique-se de que `http://localhost:3000/api/auth/callback/google` está configurado

### Erro: "access_denied"
- O usuário cancelou a autenticação
- Verifique se a Gmail API está ativada
- Confirme se o escopo `gmail.readonly` está configurado

### MCP Smithery não disponível
- O aplicativo automaticamente usa Gmail API como fallback
- Verifique se `SMITHERY_API_KEY` está configurado
- Consulte a documentação do Smithery.ai

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Smithery.ai](https://smithery.ai/) por simplificar integrações com MCPs
- [ShadCN UI](https://ui.shadcn.com/) por componentes incríveis
- [Next.js](https://nextjs.org/) por o framework React
- [Google Gmail API](https://developers.google.com/gmail) por a API de e-mails

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Consulte a [documentação do Next.js](https://nextjs.org/docs)
3. Abra uma [issue](https://github.com/seu-usuario/gmail-analytics-mcp/issues) no GitHub

---

**Desenvolvido com ❤️ usando Next.js 14, React e MCPs do Smithery.ai**






