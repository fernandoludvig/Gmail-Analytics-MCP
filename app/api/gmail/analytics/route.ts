import { NextRequest, NextResponse } from 'next/server';
import { smitheryClient } from '@/lib/smithery';
import { gmailClient } from '@/lib/gmail';
import { TopEmail } from '@/types';

// Mock data para demonstração
const generateMockAnalytics = () => {
  const sentEmails: TopEmail[] = [
    { email: 'fernando@exemplo.com', count: 171, name: 'Fernando' },
    { email: 'joao.silva@empresa.com', count: 45, name: 'João Silva' },
    { email: 'maria.santos@startup.com', count: 38, name: 'Maria Santos' },
    { email: 'pedro.oliveira@tech.com', count: 32, name: 'Pedro Oliveira' },
    { email: 'ana.costa@inovacao.com', count: 28, name: 'Ana Costa' },
    { email: 'carlos.rodrigues@digital.com', count: 24, name: 'Carlos Rodrigues' },
    { email: 'lucia.ferreira@cloud.com', count: 21, name: 'Lúcia Ferreira' },
    { email: 'rafael.mendes@data.com', count: 18, name: 'Rafael Mendes' },
    { email: 'julia.alves@ai.com', count: 15, name: 'Júlia Alves' },
    { email: 'marcos.lima@dev.com', count: 12, name: 'Marcos Lima' }
  ];

  const receivedEmails: TopEmail[] = [
    { email: 'ead@universidade.com', count: 100, name: 'EAD' },
    { email: 'newsletters@noreply.com', count: 75, name: 'Newsletters' },
    { email: 'sugestaovagas@empregos.com', count: 60, name: 'Sugestão Vagas' },
    { email: 'research@estudos.com', count: 50, name: 'Research' },
    { email: 'underarmour@sports.com', count: 45, name: 'Under Armour' },
    { email: 'info@noticias.com', count: 40, name: 'Info' },
    { email: 'smiles@loja.com', count: 35, name: 'Smiles' },
    { email: 'seaworld@parques.com', count: 30, name: 'SeaWorld' },
    { email: 'notifications@apps.com', count: 25, name: 'Notifications' },
    { email: 'support@suporte.com', count: 20, name: 'Support' }
  ];

  return {
    topSent: sentEmails,
    topReceived: receivedEmails,
    totalSent: sentEmails.reduce((sum, item) => sum + item.count, 0),
    totalReceived: receivedEmails.reduce((sum, item) => sum + item.count, 0),
    lastUpdated: new Date().toISOString(),
    mcpUsed: smitheryClient.isAvailable()
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get('mock') === 'true';
    
    if (useMock) {
      console.log('🎭 Usando dados mock para demonstração');
      const mockData = generateMockAnalytics();
      return NextResponse.json({
        success: true,
        data: mockData,
        message: 'Dados de demonstração carregados'
      });
    }

    // Obter tokens dos cookies
    const accessToken = request.cookies.get('gmail_access_token')?.value;
    const refreshToken = request.cookies.get('gmail_refresh_token')?.value;

    if (!accessToken) {
      console.log('❌ Token de acesso não encontrado nos cookies');
      return NextResponse.json({
        success: false,
        error: 'Token de acesso não encontrado. Faça login novamente.'
      }, { status: 401 });
    }

    // Configurar cliente Gmail com tokens
    gmailClient.setCredentials(accessToken, refreshToken);

    // Usar dados reais do Gmail
    console.log('📧 Buscando dados reais do Gmail...');
    const analytics = await gmailClient.getEmailAnalytics();
    console.log('✅ Dados reais obtidos do Gmail:', {
      topSent: analytics.topSent.length,
      topReceived: analytics.topReceived.length,
      totalSent: analytics.totalSent,
      totalReceived: analytics.totalReceived
    });
    
    return NextResponse.json({
      success: true,
      data: analytics,
      message: 'Dados reais do Gmail carregados com sucesso'
    });


  } catch (error) {
    console.error('❌ Erro ao buscar analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao buscar analytics de e-mail'
    }, { status: 500 });
  }
}
