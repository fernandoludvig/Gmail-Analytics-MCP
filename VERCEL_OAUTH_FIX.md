# 🚀 Corrigir OAuth para Vercel - Passo a Passo

## 🔍 PROBLEMA
A mensagem "Google não verificou este app" aparece no Vercel mas não no localhost porque:
1. OAuth consent screen não foi publicado corretamente
2. Redirect URIs não incluem o domínio do Vercel
3. Authorized domains não estão configurados

## ✅ SOLUÇÃO DEFINITIVA

### 1. Acesse Google Cloud Console
- URL: https://console.cloud.google.com/
- Selecione o projeto: **Gmail Analytics MCP**

### 2. Configure Redirect URIs
Vá em: **APIs & Services** → **Credentials** → **OAuth 2.0 Client IDs**

**Adicione estas URIs exatas:**
```
http://localhost:3000/api/auth/callback/google
https://gmail-analytics-mcp.vercel.app/api/auth/callback/google
```

### 3. Configure Authorized JavaScript Origins
**Adicione estas origens:**
```
http://localhost:3000
https://gmail-analytics-mcp.vercel.app
```

### 4. OAuth Consent Screen - CRÍTICO
Vá em: **APIs & Services** → **OAuth consent screen**

**Preencha TODOS os campos obrigatórios:**
```
App name: Gmail Analytics MCP
User support email: fernandoludvig0804@gmail.com
App logo: (opcional)
App domain homepage: https://gmail-analytics-mcp.vercel.app
Authorized domains: vercel.app
Privacy Policy URL: (opcional para uso interno)
Terms of Service URL: (opcional para uso interno)
Developer contact information: fernandoludvig0804@gmail.com
```

### 5. PUBLICAR O APP - PASSO MAIS IMPORTANTE
- Na tela **OAuth consent screen**
- Procure por **Publishing status**
- Status atual provavelmente: **"Testing"** 🔴
- Clique em: **"PUBLISH APP"** ou **"GO TO PUBLISHING"**
- Status deve mudar para: **"In production"** ✅

### 6. Verificar Escopos
Na seção **Scopes**, confirme que tem apenas:
```
../auth/userinfo.email
../auth/userinfo.profile  
../auth/gmail.readonly
```

## ⚠️ PONTOS CRÍTICOS

### Se ainda aparecer o aviso:
1. **Aguarde 10-15 minutos** após publicar
2. **Limpe cache do navegador**
3. **Teste em aba anônima**
4. **Verifique se status é "In production"**

### Verificação Final:
- ✅ App publicado (status "In production")
- ✅ Redirect URIs incluem Vercel
- ✅ Authorized domains: vercel.app
- ✅ Campos obrigatórios preenchidos

## 🎯 RESULTADO ESPERADO
- ❌ Remove aviso "Google não verificou"
- ✅ Login direto sem avisos
- ✅ Funciona em produção (Vercel)
- ✅ Funciona localmente

## 📞 SE AINDA NÃO FUNCIONAR
Faça screenshot da tela OAuth consent screen e me envie para diagnóstico específico.

