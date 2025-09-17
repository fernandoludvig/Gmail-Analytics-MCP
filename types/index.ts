export interface TopEmail {
  email: string;
  count: number;
  name?: string;
}

export interface EmailAnalytics {
  topSent: TopEmail[];
  topReceived: TopEmail[];
  totalSent: number;
  totalReceived: number;
  lastUpdated: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      data: string;
    };
    parts?: Array<{
      partId: string;
      mimeType: string;
      filename: string;
      headers: Array<{
        name: string;
        value: string;
      }>;
      body: {
        data: string;
      };
    }>;
  };
  sizeEstimate: number;
  raw: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
    picture?: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface SmitheryMCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  mcpUsed?: boolean;
}

