import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      return NextResponse.json({
        success: false,
        error: 'CLIENT_ID não configurado'
      }, { status: 400 });
    }

    // Detectar se está em produção ou desenvolvimento
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://gmail-analytics-mcp.vercel.app' // Sempre usar o domínio principal
      : 'http://localhost:3000';

    // URL de autenticação simplificada
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(`${baseUrl}/api/auth/callback/google`)}&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `include_granted_scopes=true`;

    console.log('🔗 URL de autenticação gerada:', authUrl);
    console.log('🌐 Base URL detectada:', baseUrl);
    console.log('🔧 Ambiente:', isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO');
    console.log('✅ Google Cloud Console URLs atualizadas - Build v2');
    
    return NextResponse.json({
      success: true,
      authUrl: authUrl,
      debug: {
        baseUrl,
        isProduction,
        redirectUri: `${baseUrl}/api/auth/callback/google`
      }
    });
  } catch (error) {
    console.error('❌ Erro ao gerar URL de autenticação:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao gerar URL de autenticação'
    }, { status: 500 });
  }
}
