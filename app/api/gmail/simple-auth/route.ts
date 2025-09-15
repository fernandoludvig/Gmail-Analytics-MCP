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

    // URL de autenticação simplificada para desenvolvimento
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/callback/google')}&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `include_granted_scopes=true`;

    console.log('🔗 URL de autenticação gerada:', authUrl);
    
    return NextResponse.json({
      success: true,
      authUrl: authUrl
    });
  } catch (error) {
    console.error('❌ Erro ao gerar URL de autenticação:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao gerar URL de autenticação'
    }, { status: 500 });
  }
}
