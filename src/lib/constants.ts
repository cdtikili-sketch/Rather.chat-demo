// WhatsApp Brand Colors
export const WHATSAPP = {
  PRIMARY: '#128C7E',
  PRIMARY_DARK: '#0f6a5f',
  PRIMARY_DARKER: '#085a50',
  USER_BUBBLE: '#DCF8C6',
  SUCCESS: '#25D366',
  LIGHT_BG: '#ECE5DD',
  HEADER_BG: '#1F2C34',
};

// Input Placeholders
export const INPUT_PLACEHOLDERS = {
  NAME: 'Your name',
  PHONE: 'Your phone number',
  EMAIL: 'your@email.com',
  ID_NUMBER: 'Your ID number',
  MESSAGE: 'Type a message...',
} as const;

// Flow Step IDs - Keep as constants to prevent stringly-typed code
export const STEP_IDS = {
  // Contact flow
  CONTACT_TRIGGER: 'c1',
  CONTACT_CAPTURE_NAME: 'c2',
  CONTACT_CAPTURE_PHONE: 'c3',
  CONTACT_TIME_SELECT: 'c4',
  CONTACT_HANDOFF: 'c6',

  // Connect flow
  CONNECT_TRIGGER: 'n1',
  CONNECT_CATALOG: 'n2',
  CONNECT_QUOTE_CONFIRM: 'n3',
  CONNECT_CAPTURE_NAME: 'n4',
  CONNECT_QUALIFIER: 'n5',
  CONNECT_ESTIMATE: 'n6',
  CONNECT_HANDOFF: 'n7',

  // Convert flow
  CONVERT_TRIGGER: 'v1',
  CONVERT_CAPTURE_NAME: 'v2',
  CONVERT_CAPTURE_ID: 'v3',
  CONVERT_SELECT_PLAN: 'v4',
  CONVERT_PAYMENT: 'v5',
  CONVERT_CONFIRM: 'v6',
  CONVERT_COMPLETE: 'v7',

  // Master flow
  MASTER_TRIGGER: 'm1',
  MASTER_CONTACT: 'm_contact',
  MASTER_CONNECT: 'm_connect',
  MASTER_CONVERT: 'm_convert',
  MASTER_COMPLETE: 'm_done',
} as const;

// Input Field Keys
export const INPUT_FIELDS = {
  NAME: 'name',
  PHONE: 'phone',
  ID: 'id',
  EMAIL: 'email',
} as const;

// Industries
export const INDUSTRIES = {
  INSURANCE: 'insurance',
  RETAIL: 'retail',
  FINANCE: 'finance',
  SOLAR: 'solar',
  GENERAL: 'general',
} as const;

// Button Action Prefixes
export const ACTION_PREFIX = {
  QUOTE: 'quote_',
  SHOP: 'shop_',
  APPLY: 'apply_',
  INFO: 'info_',
} as const;
