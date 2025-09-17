import { NextRequest, NextResponse } from 'next/server';
import { gmailClient } from '@/lib/gmail';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Modo desenvolvimento - gerando URL de auth...');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'Credenciais do Google não configuradas. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local'
      }, { status: 400 });
    }

    // Gerar URL de autenticação com prompt para forçar seleção de conta
    const authUrl = await gmailClient.getAuthUrl();
    
    // Adicionar parâmetros extras para desenvolvimento
    const url = new URL(authUrl);
    url.searchParams.set('prompt', 'select_account'); // Apenas seleção de conta
    url.searchParams.set('include_granted_scopes', 'true');
    // Remover parâmetros que podem causar mais avisos
    url.searchParams.delete('enable_granular_consent');

    console.log('🔗 URL de auth gerada (dev):', url.toString());

    return NextResponse.json({
      success: true,
      authUrl: url.toString(),
      message: 'URL de autenticação gerada (modo desenvolvimento)',
      note: 'Esta URL permite login com qualquer conta Gmail em desenvolvimento'
    });

  } catch (error) {
    console.error('❌ Erro ao gerar URL de auth (dev):', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor ao gerar URL de autenticação'
    }, { status: 500 });
  }
}
