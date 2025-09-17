'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Shield, BarChart3, RefreshCw } from "lucide-react";
import { AuthState } from "@/types";

interface GmailLoginFormProps {
  className?: string;
  authState: AuthState;
  onLogin: () => void;
  onLogout: () => void;
  isLoading: boolean;
}

export function GmailLoginForm({
  className,
  authState,
  onLogin,
  onLogout,
  isLoading,
  ...props
}: GmailLoginFormProps & React.ComponentPropsWithoutRef<"div">) {
  
  if (authState.isAuthenticated) {
    // Estado autenticado - mostrar perfil do usuário
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-white text-xl">Conectado com Sucesso!</CardTitle>
            <CardDescription className="text-zinc-400">
              Bem-vindo ao Gmail Analytics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Informações do usuário */}
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {authState.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {authState.user?.name || 'Usuário'}
                  </p>
                  <p className="text-zinc-400 text-sm truncate">
                    {authState.user?.email || 'email@exemplo.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700">
                <BarChart3 className="h-5 w-5 text-zinc-400 mx-auto mb-1" />
                <p className="text-zinc-400 text-xs">Analytics</p>
                <p className="text-white text-sm font-semibold">Ativo</p>
              </div>
              <div className="bg-zinc-800/30 rounded-lg p-3 text-center border border-zinc-700">
                <Shield className="h-5 w-5 text-zinc-400 mx-auto mb-1" />
                <p className="text-zinc-400 text-xs">Segurança</p>
                <p className="text-white text-sm font-semibold">OAuth2</p>
              </div>
            </div>

            {/* Botão de logout */}
            <Button 
              onClick={onLogout}
              variant="outline" 
              className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Desconectar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado não autenticado - mostrar formulário de login
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Gmail Analytics</CardTitle>
          <CardDescription className="text-zinc-400">
            Conecte sua conta Gmail para visualizar analytics detalhados dos seus e-mails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recursos do aplicativo */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-zinc-300">
              <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Top 10 destinatários e remetentes</span>
            </div>
            <div className="flex items-center space-x-3 text-zinc-300">
              <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Acesso seguro via OAuth2</span>
            </div>
            <div className="flex items-center space-x-3 text-zinc-300">
              <div className="w-6 h-6 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm">Dados em tempo real</span>
            </div>
          </div>

          {/* Botão de login */}
          <Button 
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white font-semibold py-6 text-base transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Conectar com Google
              </>
            )}
          </Button>

          {/* Aviso de privacidade */}
          <div className="text-center text-xs text-zinc-500 space-y-1">
            <p>🔒 Seus dados permanecem privados e seguros</p>
            <p>Usamos apenas permissões de leitura do Gmail</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
