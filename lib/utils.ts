import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEmail(email: string): string {
  if (!email) return '';
  
  // Extrair nome do email se estiver no formato "Nome <email@domain.com>"
  const match = email.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return match[1].trim();
  }
  
  // Se for apenas o email, extrair a parte antes do @
  const localPart = email.split('@')[0];
  return localPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function extractEmailAddress(emailString: string): string {
  if (!emailString) return '';
  
  // Extrair email do formato "Nome <email@domain.com>"
  const match = emailString.match(/<(.+?)>/);
  if (match) {
    return match[1].toLowerCase();
  }
  
  // Se for apenas o email
  return emailString.toLowerCase();
}

export function getDateRange(months: number = 12): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
}

