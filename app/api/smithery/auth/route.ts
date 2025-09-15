import { NextRequest, NextResponse } from 'next/server';
import { smitheryClient } from '@/lib/smithery';

export async function POST(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json({
        success: false,
        error: 'Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local'
      }, { status: 400 });
    }

    console.log('🔗 Iniciando autenticação via MCP Smithery...');
    const response = await smitheryClient.authenticateWithGoogle(clientId, clientSecret);
    
    if (response.success) {
      return NextResponse.json(response);
    } else {
      return NextResponse.json(response, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Erro na autenticação MCP:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
