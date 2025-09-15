import { NextResponse } from 'next/server';
import { smitheryClient } from '@/lib/smithery';

export async function GET() {
  try {
    const isAvailable = smitheryClient.isAvailable();
    
    return NextResponse.json({
      available: isAvailable,
      message: isAvailable 
        ? 'MCP do Smithery.ai disponível' 
        : 'MCP não configurado, usando fallback Gmail API'
    });
  } catch (error) {
    console.error('Erro ao verificar status MCP:', error);
    return NextResponse.json({
      available: false,
      message: 'Erro ao verificar status MCP'
    }, { status: 500 });
  }
}
