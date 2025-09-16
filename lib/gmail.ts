import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GmailMessage, TopEmail, EmailAnalytics } from '@/types';
import { extractEmailAddress, formatEmail, getDateRange } from './utils';

export class GmailAPIClient {
  private oauth2Client: OAuth2Client;
  private gmail: any;

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production';
    const redirectUri = isProduction 
      ? 'https://gmail-analytics-mcp.vercel.app/api/auth/callback/google'
      : 'http://localhost:3000/api/auth/callback/google';
      
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );
  }

  setCredentials(accessToken: string, refreshToken?: string) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async getAuthUrl(): Promise<string> {
    const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    return tokens;
  }

  async getMessages(query: string, maxResults: number = 1000): Promise<GmailMessage[]> {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: maxResults
      });

      if (!response.data.messages) {
        return [];
      }

      const messages = await Promise.all(
        response.data.messages.map(async (message: any) => {
          const fullMessage = await this.gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });
          return fullMessage.data;
        })
      );

      return messages;
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }
  }

  async getEmailAnalytics(): Promise<EmailAnalytics> {
    try {
      const sinceDate = getDateRange(12);
      
      // Buscar e-mails enviados
      const sentQuery = `label:SENT after:${sinceDate}`;
      const sentMessages = await this.getMessages(sentQuery, 1000);
      
      // Buscar e-mails recebidos
      const receivedQuery = `label:INBOX -label:SPAM after:${sinceDate}`;
      const receivedMessages = await this.getMessages(receivedQuery, 1000);

      // Processar e-mails enviados
      const sentEmails = this.processMessages(sentMessages, 'To');
      const topSent = this.getTopEmails(sentEmails);

      // Processar e-mails recebidos
      const receivedEmails = this.processMessages(receivedMessages, 'From');
      const topReceived = this.getTopEmails(receivedEmails);

      return {
        topSent,
        topReceived,
        totalSent: sentMessages.length,
        totalReceived: receivedMessages.length,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao gerar analytics:', error);
      throw error;
    }
  }

  private processMessages(messages: GmailMessage[], headerName: 'To' | 'From'): Map<string, number> {
    const emailCounts = new Map<string, number>();

    messages.forEach(message => {
      const header = message.payload?.headers?.find(h => h.name === headerName);
      if (header?.value) {
        const email = extractEmailAddress(header.value);
        if (email) {
          emailCounts.set(email, (emailCounts.get(email) || 0) + 1);
        }
      }
    });

    return emailCounts;
  }

  private getTopEmails(emailCounts: Map<string, number>): TopEmail[] {
    return Array.from(emailCounts.entries())
      .map(([email, count]) => ({
        email,
        count,
        name: formatEmail(email)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const gmailClient = new GmailAPIClient();
