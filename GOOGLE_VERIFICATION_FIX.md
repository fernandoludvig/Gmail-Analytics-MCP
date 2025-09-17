# 🚀 Como Remover o Aviso "O Google não verificou este app"

## ⚡ SOLUÇÃO RÁPIDA (5 minutos)

### 1. Acesse Google Cloud Console
- URL: https://console.cloud.google.com/
- Selecione seu projeto atual

### 2. Configure OAuth Consent Screen
- Vá em: **APIs & Services** → **OAuth consent screen**
- Clique em **EDIT APP**

### 3. Preencha Campos Obrigatórios
```
App name: Gmail Analytics MCP
User support email: seu-email@gmail.com
App logo: (opcional - pode pular)
App domain: gmail-analytics-mcp.vercel.app
Authorized domains: vercel.app
Developer contact: seu-email@gmail.com
Privacy Policy: (opcional para uso interno)
Terms of Service: (opcional para uso interno)
```

### 4. Configure Escopos Seguros
- Vá em **Scopes**
- Adicione apenas:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `.../auth/gmail.readonly`

### 5. Publique o App
- Vá para **Publishing status**
- Clique em **PUBLISH APP**
- Status deve mudar para "In production"

## ✅ RESULTADO
- ❌ Remove o aviso "Google não verificou"
- ✅ Usuários podem logar sem medo
- ✅ Funciona com qualquer conta Gmail
- ✅ Não precisa de verificação para escopos básicos

## 🔒 IMPORTANTE
- Escopos que usamos são "não-sensíveis"
- Não precisam de verificação do Google
- Publicar o app é seguro e recomendado
