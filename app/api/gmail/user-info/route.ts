import { NextRequest, NextResponse } from 'next/server';
import { gmailClient } from '@/lib/gmail';
import { OAuth2Client } from 'google-auth-library';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando informações do usuário...');

    // Buscar tokens dos cookies
    const accessToken = request.cookies.get('gmail_access_token')?.value;
    const refreshToken = request.cookies.get('gmail_refresh_token')?.value;

    if (!accessToken) {
      console.error('❌ Token de acesso não encontrado');
      return NextResponse.json({
        success: false,
        error: 'Token de acesso não encontrado. Faça login novamente.'
      }, { status: 401 });
    }

    // Configurar cliente Gmail
    gmailClient.setCredentials(accessToken, refreshToken);

    // Criar cliente OAuth2 para buscar informações do token
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    // Buscar informações do usuário via token
    let userEmail = '';
    try {
      const tokenInfo = await oauth2Client.getTokenInfo(accessToken);
      userEmail = tokenInfo.email || '';
      console.log('📧 Email do usuário obtido via token:', userEmail);
    } catch (error) {
      console.error('❌ Erro ao buscar informações do token:', error);
    }

    // Buscar perfil do usuário via Gmail API
    let userName = '';
    let userPicture = '';
    try {
      const gmail = gmailClient as any;
      if (gmail.gmail) {
        const profile = await gmail.gmail.users.getProfile({
          userId: 'me'
        });
        
        // O nome não está disponível no perfil do Gmail API
        // Vamos usar o email como fallback
        userName = userEmail.split('@')[0] || 'Usuário';
        console.log('👤 Perfil do usuário obtido:', {
          email: profile.data.emailAddress,
          messagesTotal: profile.data.messagesTotal,
          threadsTotal: profile.data.threadsTotal
        });
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil do Gmail:', error);
      // Usar email como fallback
      userName = userEmail.split('@')[0] || 'Usuário';
    }

    // Se não conseguiu obter o email, tentar via People API
    if (!userEmail) {
      try {
        const { google } = require('googleapis');
        const people = google.people({ version: 'v1', auth: oauth2Client });
        
        const profile = await people.people.get({
          resourceName: 'people/me',
          personFields: 'names,emailAddresses,photos'
        });

        if (profile.data.emailAddresses && profile.data.emailAddresses.length > 0) {
          userEmail = profile.data.emailAddresses[0].value || '';
        }

        if (profile.data.names && profile.data.names.length > 0) {
          userName = profile.data.names[0].displayName || userName;
        }

        if (profile.data.photos && profile.data.photos.length > 0) {
          userPicture = profile.data.photos[0].url || '';
        }

        console.log('👤 Dados obtidos via People API:', {
          email: userEmail,
          name: userName,
          picture: userPicture
        });
      } catch (error) {
        console.error('❌ Erro ao buscar dados via People API:', error);
      }
    }

    // Retornar dados do usuário
    const userData = {
      email: userEmail || 'usuario@exemplo.com',
      name: userName || 'Usuário',
      picture: userPicture || undefined
    };

    console.log('✅ Dados do usuário processados:', userData);

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Dados do usuário obtidos com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao buscar informações do usuário:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor ao buscar dados do usuário'
    }, { status: 500 });
  }
}
