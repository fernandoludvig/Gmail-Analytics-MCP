import { NextRequest, NextResponse } from 'next/server';
import { smitheryClient } from '@/lib/smithery';
import { gmailClient } from '@/lib/gmail';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    console.log('🔍 Callback recebido:', {
      hasCode: !!code,
      hasState: !!state,
      hasError: !!error,
      error: error
    });

    if (error) {
      console.error('❌ Erro no callback OAuth:', error);
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://gmail-analytics-mcp.vercel.app'
        : 'http://localhost:3000';
      return NextResponse.redirect(new URL('/?error=oauth_error', baseUrl));
    }

    if (!code) {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://gmail-analytics-mcp.vercel.app'
        : 'http://localhost:3000';
      return NextResponse.redirect(new URL('/?error=no_code', baseUrl));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('❌ Credenciais não configuradas');
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://gmail-analytics-mcp.vercel.app'
        : 'http://localhost:3000';
      return NextResponse.redirect(new URL('/?error=missing_credentials', baseUrl));
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

    // Buscar dados do usuário
    let userEmail = '';
    let userName = '';
    let userPicture = '';

    try {
      // Buscar informações do usuário via token
      const { OAuth2Client } = require('google-auth-library');
      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      });

      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token!);
      userEmail = tokenInfo.email || '';
      console.log('📧 Email do usuário obtido:', userEmail);

      // Tentar buscar mais dados via People API
      try {
        const { google } = require('googleapis');
        const people = google.people({ version: 'v1', auth: oauth2Client });
        
        const profile = await people.people.get({
          resourceName: 'people/me',
          personFields: 'names,emailAddresses,photos'
        });

        if (profile.data.names && profile.data.names.length > 0) {
          userName = profile.data.names[0].displayName || userEmail.split('@')[0];
        } else {
          userName = userEmail.split('@')[0] || 'Usuário';
        }

        if (profile.data.photos && profile.data.photos.length > 0) {
          userPicture = profile.data.photos[0].url || '';
        }

        console.log('👤 Dados do usuário obtidos:', {
          email: userEmail,
          name: userName,
          picture: userPicture
        });
      } catch (peopleError) {
        console.log('⚠️ People API não disponível, usando dados básicos');
        userName = userEmail.split('@')[0] || 'Usuário';
      }
    } catch (userError) {
      console.error('❌ Erro ao buscar dados do usuário:', userError);
      userEmail = 'usuario@exemplo.com';
      userName = 'Usuário';
    }

    // Armazenar tokens em cookies para uso posterior
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://gmail-analytics-mcp.vercel.app' // Sempre usar o domínio principal
      : 'http://localhost:3000';
    
    // Incluir dados do usuário na URL
    const redirectUrl = new URL('/', baseUrl);
    redirectUrl.searchParams.set('success', 'gmail_auth');
    redirectUrl.searchParams.set('authenticated', 'true');
    redirectUrl.searchParams.set('user_email', encodeURIComponent(userEmail));
    redirectUrl.searchParams.set('user_name', encodeURIComponent(userName));
    if (userPicture) {
      redirectUrl.searchParams.set('user_picture', encodeURIComponent(userPicture));
    }
    
    const response = NextResponse.redirect(redirectUrl);
    
    // Configurar cookies com os tokens
    const cookieOptions = {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      httpOnly: false, // Para permitir acesso do cliente
      secure: isProduction, // HTTPS em produção
      sameSite: 'lax' as const
    };

    response.cookies.set('gmail_access_token', tokens.access_token!, cookieOptions);
    
    if (tokens.refresh_token) {
      response.cookies.set('gmail_refresh_token', tokens.refresh_token, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30 // 30 dias
      });
    }

    return response;

  } catch (error) {
    console.error('❌ Erro no callback:', error);
    console.error('❌ Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    });
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://gmail-analytics-mcp.vercel.app'
      : 'http://localhost:3000';
    return NextResponse.redirect(new URL('/?error=callback_error', baseUrl));
  }
}
