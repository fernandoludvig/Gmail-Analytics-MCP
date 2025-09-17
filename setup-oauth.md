# 🔧 Configuração OAuth para Multi-Usuário

## ⚠️ Problema Atual
O aplicativo está em modo "Testing" no Google Cloud Console, permitindo apenas usuários pré-aprovados.

## 🛠️ Soluções

### 1. PUBLICAR O APP (Recomendado)

#### Passo a Passo:
1. **Acesse**: https://console.cloud.google.com/
2. **Navegue**: APIs & Services → OAuth consent screen
3. **Encontre**: Seu projeto atual
4. **Status atual**: "Testing" 🔴
5. **Clique**: "PUBLISH APP" ou "Edit App"

#### Campos Obrigatórios:
- **App name**: `Gmail Analytics MCP`
- **User support email**: `seu-email@gmail.com`
- **App logo**: (opcional)
- **App domain**: `gmail-analytics-mcp.vercel.app`
- **Authorized domains**: `vercel.app`
- **Developer contact**: `seu-email@gmail.com`
- **Privacy Policy URL**: (opcional)
- **Terms of Service URL**: (opcional)

#### Escopos Necessários:
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

### 2. ADICIONAR USUÁRIOS DE TESTE (Temporário)

Se não quiser publicar ainda:

1. **OAuth consent screen** → **Test users**
2. **Add users** → adicionar emails específicos
3. **Save changes**

### 3. VERIFICAR CONFIGURAÇÕES ATUAIS

#### Redirect URIs devem incluir:
- `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
- `https://gmail-analytics-mcp.vercel.app/api/auth/callback/google` (produção)

#### Authorized JavaScript origins:
- `http://localhost:3000`
- `https://gmail-analytics-mcp.vercel.app`

## 🔍 Status Esperado Após Configuração:

✅ **Publishing status**: In production  
✅ **User type**: External  
✅ **Verification status**: Não precisa para uso básico  

## 🚨 Importante:

- **Modo Testing**: Máximo 100 usuários
- **Modo Production**: Usuários ilimitados
- **Verificação**: Só necessária para escopos sensíveis (não é o nosso caso)

## 📞 Se Precisar de Ajuda:

1. Faça screenshot da tela OAuth consent screen
2. Me envie para eu te ajudar com configurações específicas
3. Posso criar um guia mais detalhado se necessário
