import { NextRequest, NextResponse } from 'next/server';
import { smitheryClient } from '@/lib/smithery';
import { gmailClient } from '@/lib/gmail';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('❌ Erro no callback OAuth:', error);
      return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Credenciais não configuradas');
      return NextResponse.redirect(new URL('/?error=missing_credentials', request.url));
    }

    console.log('🔄 Processando callback OAuth...');

    // Usar Gmail API diretamente
    console.log('🔄 Processando autenticação Gmail...');
    const tokens = await gmailClient.getTokens(code);
    console.log('✅ Tokens obtidos via Gmail API:', {
      access_token: tokens.access_token ? 'presente' : 'ausente',
      refresh_token: tokens.refresh_token ? 'presente' : 'ausente',
      expires_in: tokens.expiry_date
    });

    // Configurar o cliente Gmail com os tokens
    gmailClient.setCredentials(tokens.access_token!, tokens.refresh_token || undefined);

    // Armazenar tokens em cookies para uso posterior
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'https://seu-projeto.vercel.app' // Substitua pela URL real do seu Vercel
      : 'http://localhost:3000';
    
    const response = NextResponse.redirect(new URL('/?success=gmail_auth&authenticated=true', baseUrl));
    
    // Configurar cookies com os tokens (em produção, use httpOnly e secure)
    response.cookies.set('gmail_access_token', tokens.access_token!, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      httpOnly: false, // Para permitir acesso do cliente
      secure: false, // Para desenvolvimento local
      sameSite: 'lax'
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('gmail_refresh_token', tokens.refresh_token, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        httpOnly: false,
        secure: false,
        sameSite: 'lax'
      });
    }

    return response;

  } catch (error) {
    console.error('❌ Erro no callback:', error);
    return NextResponse.redirect(new URL('/?error=callback_error', request.url));
  }
}
