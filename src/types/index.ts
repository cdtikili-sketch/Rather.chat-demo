export type DemoMode = 'contact' | 'convert' | 'connect' | 'master';

export interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
  timestamp: Date;
  type?: 'text' | 'buttons' | 'carousel' | 'list' | 'image' | 'typing';
  buttons?: QuickReply[];
  carousel?: CarouselItem[];
  listItems?: ListItem[];
  imageUrl?: string;
  caption?: string;
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  price?: string;
  imageUrl: string;
  buttons: { label: string; action: string }[];
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
}

export interface FlowStep {
  id: string;
  botMessage: string | ((ctx: DemoContext) => string);
  type?: 'text' | 'buttons' | 'carousel' | 'list' | 'image';
  buttons?: QuickReply[];
  carousel?: CarouselItem[];
  listItems?: ListItem[];
  inputField?: { placeholder: string; key: keyof DemoContext };
  nextStep?: string;
  onSelect?: (value: string) => string;
  imageUrl?: string;
}

export interface DemoContext {
  companyName: string;
  companyUrl: string;
  industry: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  userInterest?: string;
  selectedProduct?: string;
  policyType?: string;
  sessionId?: string;
  [key: string]: string | undefined;
}
