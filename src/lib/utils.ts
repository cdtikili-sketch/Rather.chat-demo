import { WHATSAPP } from './constants';

// Generate random reference number
export function generateRefId(prefix: string = 'RC'): string {
  const randomNum = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${randomNum}`;
}

// Format text with markdown-style bold and line breaks
export function formatText(text: string): string {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// Format time in 12-hour format with ZA locale
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

// Get time display string
export const getCurrentTime = (): string =>
  typeof window === 'undefined'
    ? ''
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Detect if string is noisy offering (menu, nav, etc.)
export function isNoisyOffering(s: string): boolean {
  return (
    !s ||
    /cookie|menu|navigation|skip to|toggle|search|sign in|log in|subscribe|close|accept|reject|consent/i.test(s)
  );
}

// Compile regex patterns for industry detection once at module load
const INDUSTRY_PATTERNS = {
  insurance: /insur|hollard|discovery|ouma|old mutual|sanlam|cover|policy|claims|underwr/i,
  retail: /retail|shop|store|fashion|cloth|edgars|clicks|wear|apparel|boots|takealot/i,
  finance: /bank|financ|loan|credit|mortgage|ooba|capitec|fund|investec|absa|fnb/i,
  solar: /solar|energy|power|gosolr|sun|panel|battery|loadshed|eskom/i,
} as const;

// Detect industry - uses pre-compiled regex patterns
export function detectIndustry(url: string, name: string): string {
  const combined = (url + ' ' + name).toLowerCase();

  for (const [industry, pattern] of Object.entries(INDUSTRY_PATTERNS)) {
    if (pattern.test(combined)) return industry;
  }

  return 'general';
}

// Capitalize first letter of each word
export const capitalize = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

// Normalize industry string to one of our known values
const VALID_INDUSTRIES = ['insurance', 'retail', 'finance', 'solar', 'general'] as const;
export function normalizeIndustry(raw: string): string {
  const lower = raw.toLowerCase().trim();
  for (const valid of VALID_INDUSTRIES) {
    if (lower.includes(valid)) return valid;
  }
  return 'general';
}
