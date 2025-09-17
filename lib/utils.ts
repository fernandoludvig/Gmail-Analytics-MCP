import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções para Gmail Analytics
export function extractEmailAddress(emailString: string): string | null {
  const match = emailString.match(/<([^>]+)>/) || emailString.match(/([^\s<>]+@[^\s<>]+)/);
  return match ? match[1] || match[0] : null;
}

export function formatEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const [username, domain] = parts;
  const domainParts = domain.split('.');
  
  if (domainParts.length >= 2) {
    const mainDomain = domainParts[domainParts.length - 2];
    return `${username}@${mainDomain}`;
  }
  
  return email;
}

export function getDateRange(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0].replace(/-/g, '/');
}
