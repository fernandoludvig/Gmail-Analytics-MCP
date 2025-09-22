import { NextResponse } from 'next/server';
import { gmailClient } from '@/lib/gmail';

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local'
      }, { status: 400 });
    }

    console.log('🔗 Gerando URL de autenticação Gmail...');
    const authUrl = await gmailClient.getAuthUrl();
    
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






