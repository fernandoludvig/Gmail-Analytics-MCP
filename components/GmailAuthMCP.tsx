'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, LogIn, LogOut, User } from 'lucide-react';
import { AuthState } from '@/types';

interface GmailAuthMCPProps {
  authState: AuthState;
  onLogin: () => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
}

export default function GmailAuthMCP({ authState, onLogin, onLogout, isLoading }: GmailAuthMCPProps) {
  const [mcpStatus, setMcpStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  const checkMCPStatus = async () => {
    try {
      const response = await fetch('/api/smithery/status');
      const data = await response.json();
      setMcpStatus(data.available ? 'available' : 'unavailable');
    } catch (error) {
      setMcpStatus('unavailable');
    }
  };

  if (authState.isAuthenticated) {
    return (
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <User className="h-6 w-6 text-green-400" />
          </div>
          <CardTitle className="text-xl text-white">Conectado ao Gmail</CardTitle>
          <CardDescription className="text-slate-300">
            Analisando e-mails de {authState.user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-700/50 border border-slate-600 p-3">
            <p className="text-sm text-slate-200">
              <strong className="text-cyan-400">Status MCP:</strong> {mcpStatus === 'available' ? '✅ Ativo' : '⚠️ Fallback Gmail API'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {mcpStatus === 'available' 
                ? 'Usando MCP do Smithery.ai para análise simplificada'
                : 'Usando Gmail API tradicional (configuração manual necessária)'
              }
            </p>
          </div>
          <Button 
            onClick={onLogout} 
            variant="outline" 
            className="w-full border-red-500/30 text-red-300 hover:bg-red-500/10"
            disabled={isLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Desconectar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
          <Mail className="h-6 w-6 text-cyan-400" />
        </div>
        <CardTitle className="text-xl text-white">Gmail Analytics MCP</CardTitle>
        <CardDescription className="text-slate-300">
          Conecte-se ao Gmail para analisar seus e-mails usando MCPs do Smithery.ai
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-slate-700/50 border border-slate-600 p-3">
          <h4 className="font-medium text-sm mb-2 text-cyan-300">🔗 Integração Simplificada</h4>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Autenticação OAuth2 automática</li>
            <li>• Sem configuração complexa</li>
            <li>• Análise de e-mails em tempo real</li>
            <li>• Dados seguros e privados</li>
          </ul>
        </div>
        
        <Button 
          onClick={onLogin} 
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          {isLoading ? 'Conectando...' : 'Login com Google'}
        </Button>

        <div className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={checkMCPStatus}
            className="text-xs text-slate-400 hover:text-cyan-300"
          >
            Verificar Status MCP
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
