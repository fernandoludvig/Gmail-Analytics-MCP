'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TopEmail } from '@/types';
import { TrendingUp, Users, Mail, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface EmailAnalyticsProps {
  data: TopEmail[];
  title: string;
  description: string;
  isLoading: boolean;
  totalCount: number;
  icon: React.ReactNode;
  color: string;
}

export default function EmailAnalytics({ 
  data, 
  title, 
  description, 
  isLoading, 
  totalCount,
  icon,
  color 
}: EmailAnalyticsProps) {
  const [chartType, setChartType] = useState<'vertical' | 'pie'>('pie');

  if (isLoading) {
    return (
      <Card className="w-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {icon}
              <div>
                <Skeleton className="h-6 w-48 bg-slate-700" />
                <Skeleton className="h-4 w-32 mt-2 bg-slate-700" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 bg-slate-700" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loading do Gráfico */}
          <div className="h-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-sm text-slate-300">Carregando dados do Gmail...</p>
              </div>
            </div>
          </div>
          
          {/* Loading da Tabela */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-slate-700" />
              <Skeleton className="h-3 w-24 bg-slate-700" />
            </div>
            <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/50 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full bg-slate-700" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32 bg-slate-700" />
                      <Skeleton className="h-3 w-48 bg-slate-700" />
                    </div>
                    <Skeleton className="h-6 w-12 bg-slate-700" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Validar e filtrar dados para evitar NaN
  const validData = data && Array.isArray(data) ? data : [];
  const chartData = validData
    .slice(0, 10)
    .filter(item => 
      item && 
      typeof item === 'object' && 
      typeof item.count === 'number' && 
      !isNaN(item.count) && 
      item.count > 0 &&
      item.email
    )
    .map((item, index) => ({
      name: (item.name || item.email.split('@')[0] || 'Unknown').substring(0, 20),
      email: item.email || 'unknown@example.com',
      count: Math.max(1, Math.floor(item.count)), // Garantir número inteiro positivo
      rank: index + 1
    }));

  // Calcular total real baseado nos top 10 dados
  const realTotal = chartData.reduce((sum, item) => sum + item.count, 0);

  // Se não há dados válidos, mostrar mensagem
  if (chartData.length === 0) {
    return (
      <Card className="w-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-2">
            {icon}
            <div>
              <CardTitle className="text-white">{title}</CardTitle>
              <CardDescription className="text-slate-300">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <p>Nenhum dado disponível para exibição</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Função para renderizar tooltip
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">
            {data.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.email}
          </p>
          <p className="text-lg font-bold" style={{ color }}>
            {data.count} e-mails
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rank #{data.rank}
          </p>
        </div>
      );
    }
    return null;
  };

  // Função para cores do gráfico de pizza
  const getPieColor = (index: number) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[index % colors.length];
  };

  // Calcular percentual correto baseado no total real
  const calculatePercentage = (count: number) => {
    if (!data || data.length === 0 || !count || isNaN(count)) return 0;
    const validCounts = data.map(d => d.count).filter(c => typeof c === 'number' && !isNaN(c) && c > 0);
    if (validCounts.length === 0) return 0;
    const maxCount = Math.max(...validCounts);
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  };

  return (
    <Card className="w-full bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <div>
              <CardTitle className="text-xl text-white">{title}</CardTitle>
              <CardDescription className="text-slate-300">{description}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {realTotal.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Total</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controles do Gráfico */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Visualização dos Dados</h3>
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'vertical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('vertical')}
              className={chartType === 'vertical' 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white' 
                : 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Barras Verticais
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('pie')}
              className={chartType === 'pie' 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white' 
                : 'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'
              }
            >
              <PieChartIcon className="h-4 w-4 mr-2" />
              Pizza
            </Button>
          </div>
        </div>

        {/* Gráfico Dinâmico */}
        <div className="h-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'vertical' ? (
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  <linearGradient id={`gradient-v-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={color} stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} angle={-45} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip content={renderTooltip} />
                <Bar dataKey="count" fill={`url(#gradient-v-${color})`} radius={[8, 8, 0, 0]} stroke={color} strokeWidth={1} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData.slice(0, 10)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getPieColor(index)} />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ paddingLeft: '20px' }}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontSize: '12px' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Tabela de Dados Melhorada */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-300">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span>Ranking Detalhado</span>
            </div>
            <div className="text-xs text-slate-400">
              Mostrando top {Math.min(data.length, 10)} de {data.length}
            </div>
          </div>
          
          <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/50 backdrop-blur-sm shadow-sm">
            <Table>
              <TableHeader className="bg-slate-700/50">
                <TableRow>
                  <TableHead className="w-20 text-center font-semibold text-slate-200">Rank</TableHead>
                  <TableHead className="font-semibold text-slate-200">Contato</TableHead>
                  <TableHead className="w-24 text-right font-semibold text-slate-200">E-mails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.slice(0, 10).map((item, index) => {
                  return (
                    <TableRow 
                      key={item.email}
                      className="hover:bg-slate-700/30 transition-colors border-slate-700"
                    >
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r from-cyan-500 to-purple-500"
                          >
                            {index + 1}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-white">
                            {item.name || item.email.split('@')[0]}
                          </div>
                          <div className="text-sm text-slate-400 truncate max-w-xs">
                            {item.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <span className="font-bold text-lg text-cyan-400">
                            {item.count}
                          </span>
                          <span className="text-xs text-slate-400">
                            {item.count === 1 ? 'e-mail' : 'e-mails'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
