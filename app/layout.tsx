import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gmail Analytics MCP',
  description: 'Análise inteligente de e-mails usando MCPs do Smithery.ai',
  keywords: ['gmail', 'analytics', 'email', 'mcp', 'smithery', 'next.js'],
  authors: [{ name: 'Gmail Analytics Team' }],
  openGraph: {
    title: 'Gmail Analytics MCP',
    description: 'Análise inteligente de e-mails usando MCPs do Smithery.ai',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gmail Analytics MCP',
    description: 'Análise inteligente de e-mails usando MCPs do Smithery.ai',
  }
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#0f172a',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        {/* <Toaster 
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#f1f5f9',
            },
          }}
        /> */}
      </body>
    </html>
  );
}
