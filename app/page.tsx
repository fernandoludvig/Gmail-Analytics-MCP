'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GmailLoginForm } from '@/components/GmailLoginForm';
import EmailAnalytics from '@/components/EmailAnalytics';
import { AuthState, EmailAnalytics as EmailAnalyticsType, TopEmail } from '@/types';
import { RefreshCw, BarChart3, Mail, Send, Inbox, AlertCircle, Shield } from 'lucide-react';
// import { toast } from 'sonner';

export default function HomePage() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null
  });
  
  const [analytics, setAnalytics] = useState<EmailAnalyticsType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Verificar se há credenciais configuradas
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    const checkCredentials = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      setHasCredentials(!!clientId);
    };
    checkCredentials();
  }, []);

  const handleLogin = async () => {
    console.log('🔑 Iniciando processo de login...');
    setIsLoading(true);
    try {
      // Usar endpoint de desenvolvimento em localhost para evitar restrições OAuth
      const isDev = window.location.hostname === 'localhost';
      const endpoint = isDev ? '/api/gmail/dev-auth' : '/api/gmail/simple-auth';
      
      console.log(`📡 Fazendo requisição para ${endpoint} (${isDev ? 'desenvolvimento' : 'produção'})`);
      const response = await fetch(endpoint);
      const data = await response.json();
      
      console.log('📋 Resposta da API:', data);

      if (data.success) {
        console.log('✅ URL de autenticação obtida:', data.authUrl);
        if (isDev && data.note) {
          console.log('ℹ️', data.note);
        }
        // Redirecionar para OAuth
        window.location.href = data.authUrl;
      } else {
        console.error('❌ Erro na resposta da API:', data.error);
        console.error('❌', data.error || 'Erro na autenticação');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Erro ao conectar com Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Limpar cookies
    document.cookie = 'gmail_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'gmail_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null
    });
    setAnalytics(null);
    console.log('✅ Desconectado com sucesso');
  };

  const loadAnalytics = async (useMock = false) => {
    setIsRefreshing(true);
    try {
      console.log('📊 Carregando analytics...', { useMock });
      const response = await fetch(`/api/gmail/analytics?mock=${useMock}`, {
        credentials: 'include' // Incluir cookies na requisição
      });
      const data = await response.json();

      console.log('📋 Resposta da API analytics:', data);

      if (data.success) {
        setAnalytics(data.data);
        console.log('✅', data.message || 'Analytics carregados com sucesso');
        console.log('✅ Analytics carregados:', data.data);
      } else {
        console.error('❌ Erro na resposta:', data.error);
        console.error('❌', data.error || 'Erro ao carregar analytics');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar analytics:', error);
      console.error('❌ Erro ao carregar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics(false); // Usar dados reais do Gmail
  };

  const loadUserInfo = async () => {
    try {
      console.log('👤 Buscando informações do usuário...');
      const response = await fetch('/api/gmail/user-info', {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: data.data
        }));
        console.log('✅ Informações do usuário carregadas:', data.data);
        return data.data;
      } else {
        console.error('❌ Erro ao buscar informações do usuário:', data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao buscar informações do usuário:', error);
      return null;
    }
  };

  // Verificar se há credenciais configuradas e processar callback OAuth
  useEffect(() => {
    const checkCredentials = async () => {
      try {
        // Verificar se a API simplificada está funcionando
        const response = await fetch('/api/gmail/simple-auth');
        const data = await response.json();
        setHasCredentials(data.success);
        console.log('🔍 Verificação de credenciais:', data.success);
      } catch (error) {
        console.error('❌ Erro ao verificar credenciais:', error);
        setHasCredentials(false);
      }
    };

    const checkExistingAuth = async () => {
      // Verificar se já há tokens nos cookies
      const hasTokens = document.cookie.includes('gmail_access_token');
      if (hasTokens) {
        console.log('🔍 Tokens encontrados, verificando autenticação...');
        const userInfo = await loadUserInfo();
        if (userInfo) {
          console.log('✅ Usuário já autenticado');
          // Carregar analytics automaticamente
          setTimeout(() => {
            loadAnalytics(false);
          }, 500);
        }
      }
    };

    // Verificar se retornou da autenticação
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const authenticated = urlParams.get('authenticated');
    const userEmail = urlParams.get('user_email');
    const userName = urlParams.get('user_name');
    const userPicture = urlParams.get('user_picture');
    
    if (success === 'gmail_auth' && authenticated === 'true') {
      setAuthState({
        isAuthenticated: true,
        user: {
          email: decodeURIComponent(userEmail || 'usuario@exemplo.com'),
          name: decodeURIComponent(userName || 'Usuário'),
          picture: userPicture ? decodeURIComponent(userPicture) : undefined
        },
        accessToken: 'authenticated_token',
        refreshToken: 'authenticated_refresh_token'
      });
      console.log('✅ Login realizado com sucesso!');
      
      // Carregar dados reais após autenticação
      setTimeout(() => {
        loadAnalytics(false);
      }, 1000); // Aguardar 1 segundo para os cookies serem definidos
      
      // Limpar URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Executar verificações
    checkCredentials();
    
    // Se não é callback OAuth, verificar autenticação existente
    if (!urlParams.has('success')) {
      checkExistingAuth();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-800/5 via-transparent to-zinc-700/10"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-1 bg-gradient-to-r from-zinc-600 to-zinc-400 rounded-full mb-4">
            <div className="bg-zinc-950 px-6 py-2 rounded-full">
              <h1 className="text-4xl font-bold text-white mb-2">
                Gmail Analytics MCP
              </h1>
            </div>
          </div>
          <p className="text-lg text-zinc-400 font-light">
            Análise inteligente de e-mails usando MCPs do Smithery.ai
          </p>
        </div>

        {/* Status das Credenciais */}
        {!hasCredentials && (
          <Card className="mb-6 border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-zinc-400" />
                <CardTitle className="text-white">
                  Configuração Necessária
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-4">
                Para usar o aplicativo, configure as credenciais do Google OAuth no arquivo <code className="text-zinc-200 bg-zinc-800 px-1 py-0.5 rounded">.env.local</code>:
              </p>
              <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-md">
                <code className="text-sm text-zinc-300">
                  GOOGLE_CLIENT_ID=seu_client_id<br/>
                  GOOGLE_CLIENT_SECRET=seu_client_secret
                </code>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Descrição do Aplicativo */}
        {hasCredentials && (
          <Card className="mb-6 border-zinc-700 bg-zinc-900/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-zinc-400" />
                <CardTitle className="text-white">
                  📊 Descubra Seus Padrões de Comunicação
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-300 text-base leading-relaxed">
                Transforme seus dados de e-mail em insights valiosos! Descubra com quem você mais se comunica, 
                identifique seus principais contatos e entenda seus hábitos de comunicação dos últimos 12 meses.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Send className="h-4 w-4 text-zinc-400" />
                    <h4 className="text-white font-medium">E-mails Enviados</h4>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Veja para quem você mais envia e-mails e descubra seus principais destinatários
                  </p>
                </div>
                
                <div className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Inbox className="h-4 w-4 text-zinc-400" />
                    <h4 className="text-white font-medium">E-mails Recebidos</h4>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Identifique quem mais entra em contato com você e seus remetentes frequentes
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-zinc-800/30 to-zinc-700/30 border border-zinc-600/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-zinc-400" />
                  <span className="text-white font-medium">100% Seguro e Privado</span>
                </div>
                <p className="text-sm text-zinc-400">
                  Seus dados nunca são armazenados. Utilizamos apenas permissões de leitura do Gmail 
                  com autenticação OAuth2 oficial do Google.
                </p>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Autenticação */}
          <div className="lg:col-span-1">
            <GmailLoginForm
              authState={authState}
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoading={isLoading}
            />
          </div>

          {/* Dashboard de Analytics */}
          <div className="lg:col-span-2">
            {authState.isAuthenticated ? (
              <div className="space-y-6">
                {/* Controles */}
                <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-zinc-400" />
                        <CardTitle className="text-white">Dashboard de Analytics</CardTitle>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleRefresh} 
                          disabled={isRefreshing}
                          variant="outline"
                          size="sm"
                          className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                          Atualizar
                        </Button>
                        <Button 
                          onClick={() => loadAnalytics(false)} 
                          disabled={isRefreshing}
                          size="sm"
                          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white"
                        >
                          📧 Carregar Dados Reais
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-zinc-400">
                      Análise dos últimos 12 meses de e-mails
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Tabs de Analytics */}
                <Tabs defaultValue="sent" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-zinc-800/50 border-zinc-700">
                    <TabsTrigger 
                      value="sent" 
                      className="flex items-center space-x-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400"
                    >
                      <Send className="h-4 w-4" />
                      <span>E-mails Enviados</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="received" 
                      className="flex items-center space-x-2 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400"
                    >
                      <Inbox className="h-4 w-4" />
                      <span>E-mails Recebidos</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sent" className="space-y-4">
                    <EmailAnalytics
                      data={analytics?.topSent || []}
                      title="Top 10 Destinatários"
                      description="Pessoas que mais receberam seus e-mails"
                      isLoading={isRefreshing}
                      totalCount={analytics?.totalSent || 0}
                      icon={<Send className="h-5 w-5 text-green-600" />}
                      color="#10b981"
                    />
                  </TabsContent>

                  <TabsContent value="received" className="space-y-4">
                    <EmailAnalytics
                      data={analytics?.topReceived || []}
                      title="Top 10 Remetentes"
                      description="Pessoas que mais enviaram e-mails para você"
                      isLoading={isRefreshing}
                      totalCount={analytics?.totalReceived || 0}
                      icon={<Inbox className="h-5 w-5 text-blue-600" />}
                      color="#3b82f6"
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="bg-zinc-900/50 border-zinc-700 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="p-4 bg-zinc-800 rounded-full mb-4 inline-block">
                      <Mail className="h-12 w-12 text-zinc-400" />
                    </div>
                    <p className="text-zinc-400 text-lg">
                      Faça login para visualizar seus analytics
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-zinc-500">
          <p>
            Powered by <strong className="text-zinc-300">Smithery.ai MCPs</strong> • 
            Desenvolvido com <strong className="text-zinc-300">Next.js 14</strong> e <strong className="text-zinc-300">ShadCN UI</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
