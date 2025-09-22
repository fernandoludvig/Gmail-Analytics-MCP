#!/usr/bin/env node

/**
 * Script para verificar configuração OAuth do Google
 * Execute: node verificar-oauth.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração OAuth...\n');

// Verificar arquivo .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env.local não encontrado');
  console.log('📝 Copie env.example para .env.local e configure suas credenciais');
  process.exit(1);
}

// Ler arquivo .env.local manualmente
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const envVars = {};

lines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const clientId = envVars.GOOGLE_CLIENT_ID;
const clientSecret = envVars.GOOGLE_CLIENT_SECRET;

console.log('📋 Verificação de Credenciais:');
console.log(`   CLIENT_ID: ${clientId ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`   CLIENT_SECRET: ${clientSecret ? '✅ Configurado' : '❌ Não configurado'}\n`);

if (!clientId || !clientSecret) {
  console.log('⚠️  Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local');
  process.exit(1);
}

// Verificar formato do CLIENT_ID
if (!clientId.includes('.googleusercontent.com')) {
  console.log('⚠️  CLIENT_ID parece estar incorreto (deve terminar com .googleusercontent.com)');
}

console.log('🔗 URLs de Redirecionamento Configuradas:');
console.log('   Desenvolvimento: http://localhost:3000/api/auth/callback/google');
console.log('   Produção: https://gmail-analytics-mcp.vercel.app/api/auth/callback/google\n');

console.log('📝 Próximos Passos:');
console.log('1. Acesse: https://console.cloud.google.com/');
console.log('2. Vá em "APIs e Serviços" → "Credenciais"');
console.log('3. Verifique se as URLs acima estão configuradas');
console.log('4. Vá em "OAuth consent screen"');
console.log('5. Publique o aplicativo (mude de "Em teste" para "Em produção")\n');

console.log('✅ Configuração básica verificada!');
console.log('📖 Consulte SOLUCAO_VERIFICACAO_GOOGLE.md para instruções detalhadas');
