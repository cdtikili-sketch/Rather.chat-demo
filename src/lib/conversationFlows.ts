import { FlowStep, DemoContext, CarouselItem, QuickReply } from '../types';
import { generateRefId, isNoisyOffering, capitalize, detectIndustry } from './utils';
import { INDUSTRIES, INPUT_FIELDS, INPUT_PLACEHOLDERS } from './constants';

function getIndustryProducts(industry: string, companyName: string): CarouselItem[] {
  const industryMap: Record<string, CarouselItem[]> = {
    insurance: [
      { id: 'p1', title: 'Life Cover', subtitle: 'Protect your family\'s future', price: 'From R199/mo', imageUrl: 'https://images.pexels.com/photos/3791136/pexels-photo-3791136.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_life' }, { label: 'Learn More', action: 'info_life' }] },
      { id: 'p2', title: 'Car Insurance', subtitle: 'Comprehensive vehicle protection', price: 'From R349/mo', imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_car' }, { label: 'Learn More', action: 'info_car' }] },
      { id: 'p3', title: 'Home Insurance', subtitle: 'Secure your biggest asset', price: 'From R299/mo', imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_home' }, { label: 'Learn More', action: 'info_home' }] },
    ],
    retail: [
      { id: 'p1', title: 'Summer Collection', subtitle: 'New arrivals now in store', price: 'From R299', imageUrl: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Shop Now', action: 'shop_summer' }, { label: 'View More', action: 'view_summer' }] },
      { id: 'p2', title: 'Footwear Range', subtitle: 'Step into style this season', price: 'From R499', imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Shop Now', action: 'shop_shoes' }, { label: 'View More', action: 'view_shoes' }] },
      { id: 'p3', title: 'Accessories', subtitle: 'Complete your look today', price: 'From R149', imageUrl: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Shop Now', action: 'shop_acc' }, { label: 'View More', action: 'view_acc' }] },
    ],
    finance: [
      { id: 'p1', title: 'Home Loan', subtitle: 'Your dream home awaits', price: 'From 9.25% p.a.', imageUrl: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Apply Now', action: 'apply_homeloan' }, { label: 'Calculate', action: 'calc_homeloan' }] },
      { id: 'p2', title: 'Personal Loan', subtitle: 'Fast approval, same-day payout', price: 'Up to R250,000', imageUrl: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Apply Now', action: 'apply_personal' }, { label: 'Calculate', action: 'calc_personal' }] },
      { id: 'p3', title: 'Business Finance', subtitle: 'Grow your business faster', price: 'Up to R5M', imageUrl: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Apply Now', action: 'apply_biz' }, { label: 'Calculate', action: 'calc_biz' }] },
    ],
    solar: [
      { id: 'p1', title: 'Home Solar Kit', subtitle: '5kW system with battery backup', price: 'From R89,999', imageUrl: 'https://images.pexels.com/photos/9875441/pexels-photo-9875441.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_home_solar' }, { label: 'Learn More', action: 'info_home_solar' }] },
      { id: 'p2', title: 'Business Solar', subtitle: 'Reduce operating costs by 60%', price: 'From R249,999', imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_biz_solar' }, { label: 'Learn More', action: 'info_biz_solar' }] },
      { id: 'p3', title: 'Load Shedding Pack', subtitle: 'Stay powered during outages', price: 'From R24,999', imageUrl: 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Get Quote', action: 'quote_loadshed' }, { label: 'Learn More', action: 'info_loadshed' }] },
    ],
    general: [
      { id: 'p1', title: `${companyName} Premium`, subtitle: 'Our most popular solution', price: 'Contact for pricing', imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Enquire Now', action: 'enquire_premium' }, { label: 'Learn More', action: 'info_premium' }] },
      { id: 'p2', title: `${companyName} Standard`, subtitle: 'Perfect for growing businesses', price: 'Contact for pricing', imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Enquire Now', action: 'enquire_standard' }, { label: 'Learn More', action: 'info_standard' }] },
      { id: 'p3', title: `${companyName} Starter`, subtitle: 'Get started today', price: 'Contact for pricing', imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400&h=250&fit=crop', buttons: [{ label: 'Enquire Now', action: 'enquire_starter' }, { label: 'Learn More', action: 'info_starter' }] },
    ],
  };
  return industryMap[industry] || industryMap.general;
}

export function getContactFlow(ctx: DemoContext): FlowStep[] {
  return [
    {
      id: 'trigger',
      botMessage: (c) => `Hey there! 👋 Thanks for reaching out to *${c.companyName}*.\n\nI'm here to help. What can I do for you?`,
      type: 'buttons',
      buttons: [{ id: 'start', label: '📋 I\'d like to enquire', value: 'interested' }],
      nextStep: 'qualify_1',
    },
    {
      id: 'qualify_1',
      botMessage: `Is this for you personally, or are you enquiring on behalf of a company?`,
      type: 'buttons',
      buttons: [
        { id: 'personal', label: '👤 Personal', value: 'personal' },
        { id: 'business', label: '🏢 Business', value: 'business' },
      ],
      nextStep: 'qualify_2',
    },
    {
      id: 'qualify_2',
      botMessage: (c) => `Got it. What specifically interests you about *${c.companyName}*?`,
      type: 'buttons',
      buttons: getInterestButtons,
      nextStep: 'capture_name',
    },
    {
      id: 'capture_name',
      botMessage: `Perfect. Let me get your details so we can follow up.\n\nWhat's your name?`,
      inputField: { placeholder: 'Your name', key: 'userName' },
      nextStep: 'capture_phone',
    },
    {
      id: 'capture_phone',
      botMessage: (c) => `Thanks ${c.userName || 'there'}! 👍\n\nWhat's the best number to reach you?`,
      inputField: { placeholder: 'Your phone number', key: 'userPhone' },
      nextStep: 'capture_email',
    },
    {
      id: 'capture_email',
      botMessage: `And an email address? (You can skip this if you prefer)`,
      inputField: { placeholder: 'your@email.com', key: 'userEmail' },
      nextStep: 'confirm',
    },
    {
      id: 'confirm',
      botMessage: (c) => `Just confirming:\n\n*Name:* ${c.userName || 'Not provided'}\n*Phone:* ${c.userPhone || 'Not provided'}\n*Interested in:* ${c.userInterest || 'General'}\n\nLooks good? I'll send this through to the team.`,
      type: 'buttons',
      buttons: [
        { id: 'yes', label: '✓ Yes, send it', value: 'confirm_yes' },
        { id: 'edit', label: '✏️ Change something', value: 'edit' },
      ],
      nextStep: 'complete',
    },
    {
      id: 'complete',
      botMessage: (c) => `All done! 👍\n\nSomeone from the *${c.companyName}* team will get back to you within 2 hours.\n\n📍 *Ref:* ${generateRefId()}`,
      type: 'buttons',
      buttons: [
        { id: 'faq', label: '❓ Got more questions?', value: 'more' },
        { id: 'done', label: '👋 Thanks, bye!', value: 'done' },
      ],
    },
  ];
}

export function getConvertFlow(ctx: DemoContext): FlowStep[] {
  const products = getIndustryProducts(ctx.industry, ctx.companyName);
  return [
    {
      id: 'trigger',
      botMessage: (c) => `Hey! 👋 Welcome to *${c.companyName}*.\n\nLooking to shop or get more info?`,
      type: 'buttons',
      buttons: [{ id: 'start', label: '🛍️ Let\'s do this', value: 'browse' }],
      nextStep: 'show_catalog',
    },
    {
      id: 'show_catalog',
      botMessage: `Here's what we've got for you 👇`,
      type: 'carousel',
      carousel: products,
      nextStep: 'product_selected',
    },
    {
      id: 'product_selected',
      botMessage: (c) => `Nice choice — *${c.selectedProduct || products[0].title}*. What would you like to do?`,
      type: 'buttons',
      buttons: [
        { id: 'quote', label: '💬 Get a quote', value: 'get_quote' },
        { id: 'buy', label: '✓ Buy now', value: 'buy_now' },
        { id: 'agent', label: '👤 Talk to someone', value: 'agent' },
      ],
      nextStep: 'qualify_purchase',
    },
    {
      id: 'qualify_purchase',
      botMessage: `Quick question — who's this for?`,
      type: 'buttons',
      buttons: [
        { id: 'ind', label: '👤 Just me', value: 'individual' },
        { id: 'biz', label: '🏢 My business', value: 'business' },
        { id: 'fam', label: '👨‍👩‍👧 Family', value: 'family' },
      ],
      nextStep: 'capture_name',
    },
    {
      id: 'capture_name',
      botMessage: `Let me get a few details.\n\nYour name?`,
      inputField: { placeholder: 'Your name', key: 'userName' },
      nextStep: 'capture_phone',
    },
    {
      id: 'capture_phone',
      botMessage: (c) => `Thanks *${c.userName || 'there'}*!\n\nBest number to reach you?`,
      inputField: { placeholder: 'Your phone number', key: 'userPhone' },
      nextStep: 'capture_id',
    },
    {
      id: 'capture_id',
      botMessage: `ID number for verification?`,
      inputField: { placeholder: 'Your ID number', key: 'userIdNumber' },
      nextStep: 'payment_options',
    },
    {
      id: 'payment_options',
      botMessage: `How would you like to pay?`,
      type: 'buttons',
      buttons: [
        { id: 'debit', label: '🏦 Debit Order', value: 'debit_order' },
        { id: 'card', label: '💳 Card', value: 'card' },
        { id: 'eft', label: '🔁 EFT', value: 'eft' },
      ],
      nextStep: 'confirm_purchase',
    },
    {
      id: 'confirm_purchase',
      botMessage: (c) => `Confirming your order:\n\n*${c.selectedProduct || products[0].title}*\n*Name:* ${c.userName}\n*Payment:* ${c.paymentMethod || 'Debit Order'}\n\nReady to go?`,
      type: 'buttons',
      buttons: [
        { id: 'confirm', label: '✓ Confirm', value: 'confirmed' },
        { id: 'cancel', label: '✕ Cancel', value: 'cancel' },
      ],
      nextStep: 'sale_complete',
    },
    {
      id: 'sale_complete',
      botMessage: (c) => `Perfect! ✓\n\nYour *${c.selectedProduct || products[0].title}* has been confirmed.\n\n📋 *Ref:* ${generateRefId()}\n📧 Check your email for the details.\n\nThanks for choosing *${c.companyName}*! 🎉`,
      type: 'buttons',
      buttons: [
        { id: 'more', label: '🛍️ Shop more', value: 'more' },
        { id: 'done', label: '👋 Done', value: 'done' },
      ],
    },
  ];
}

export function getConnectFlow(ctx: DemoContext): FlowStep[] {
  return [
    {
      id: 'trigger',
      botMessage: (c) => `Hey! 👋 I'm *${c.companyName}*'s assistant.\n\nHow can I help you today?`,
      type: 'buttons',
      buttons: [
        { id: 'info', label: '📋 Info & details', value: 'product_info' },
        { id: 'quote', label: '💰 Get a quote', value: 'get_quote' },
        { id: 'support', label: '🛠️ Support', value: 'support' },
        { id: 'agent', label: '👤 Talk to someone', value: 'human_agent' },
      ],
      nextStep: 'topic_selected',
    },
    {
      id: 'topic_selected',
      botMessage: (c) => `Got it! Let me help you with that.\n\nWhich of these interests you most?`,
      type: 'buttons',
      buttons: getConnectTopics,
      nextStep: 'provide_info',
    },
    {
      id: 'provide_info',
      botMessage: (c) => `Here's the lowdown on *${c.companyName}*:\n\n${getIndustryInfo(c.industry, c.companyName)}\n\nNeed more details on anything?`,
      type: 'buttons',
      buttons: [
        { id: 'more', label: '📖 Tell me more', value: 'more_info' },
        { id: 'quote', label: '💰 Get a quote', value: 'quote' },
        { id: 'agent', label: '👤 Chat with someone', value: 'specialist' },
      ],
      nextStep: 'qualify_connect',
    },
    {
      id: 'qualify_connect',
      botMessage: `How urgent is this for you?`,
      type: 'buttons',
      buttons: [
        { id: 'now', label: '🔴 ASAP', value: 'urgent' },
        { id: 'today', label: '🟡 Today', value: 'today' },
        { id: 'week', label: '🟢 This week', value: 'flexible' },
      ],
      nextStep: 'capture_name',
    },
    {
      id: 'capture_name',
      botMessage: `Let me get a couple of details.\n\nYour name?`,
      inputField: { placeholder: 'Your name', key: 'userName' },
      nextStep: 'capture_phone',
    },
    {
      id: 'capture_phone',
      botMessage: (c) => `Thanks ${c.userName || 'there'}! 📱\n\nBest number to reach you?`,
      inputField: { placeholder: 'Your phone number', key: 'userPhone' },
      nextStep: 'preference',
    },
    {
      id: 'preference',
      botMessage: `How do you prefer to be contacted?`,
      type: 'buttons',
      buttons: [
        { id: 'wa', label: '💬 WhatsApp', value: 'whatsapp' },
        { id: 'call', label: '📞 Call', value: 'call' },
        { id: 'email', label: '📧 Email', value: 'email' },
      ],
      nextStep: 'connect_complete',
    },
    {
      id: 'connect_complete',
      botMessage: (c) => `Perfect! You're all set.\n\nA specialist from *${c.companyName}* will reach out to you via your preferred method.\n\n📍 *Ref:* ${generateRefId()}`,
      type: 'buttons',
      buttons: [
        { id: 'faq', label: '❓ Any other questions?', value: 'faq' },
        { id: 'done', label: '👋 All good!', value: 'done' },
      ],
    },
  ];
}

export function getMasterFlow(ctx: DemoContext): FlowStep[] {
  return [
    {
      id: 'trigger',
      botMessage: (c) => `Hey! 👋 Welcome to *${c.companyName}*.\n\nI can help you with any of these:\n\n📥 *Get info* — Capture your enquiry\n💬 *Chat* — Get advice & details\n🛍️ *Shop* — Buy directly here\n\nWhat'll it be?`,
      type: 'buttons',
      buttons: [
        { id: 'contact', label: '📥 Enquire', value: 'contact_flow' },
        { id: 'connect', label: '💬 Chat', value: 'connect_flow' },
        { id: 'convert', label: '🛍️ Shop', value: 'convert_flow' },
        { id: 'support', label: '🛠️ Support', value: 'support' },
      ],
      nextStep: 'route',
    },
    {
      id: 'route',
      botMessage: (c) => `Great! Let me set that up for you...`,
      type: 'buttons',
      buttons: [{ id: 'go', label: '▶️ Go', value: 'proceed' }],
      nextStep: 'qualify',
    },
    {
      id: 'qualify',
      botMessage: (c) => `Quick one — first time chatting with us?`,
      type: 'buttons',
      buttons: [
        { id: 'new', label: '🆕 New here', value: 'new' },
        { id: 'exist', label: '🔄 Already a customer', value: 'existing' },
      ],
      nextStep: 'interest',
    },
    {
      id: 'interest',
      botMessage: (c) => `What catches your interest?`,
      type: 'buttons',
      buttons: getInterestButtons,
      nextStep: 'show_catalog',
    },
    {
      id: 'show_catalog',
      botMessage: `Check out what we've got 👇`,
      type: 'carousel',
      carousel: getIndustryProducts(ctx.industry, ctx.companyName),
      nextStep: 'capture_name',
    },
    {
      id: 'capture_name',
      botMessage: `Nice pick! Let me get your details.\n\nYour name?`,
      inputField: { placeholder: 'Your name', key: 'userName' },
      nextStep: 'capture_phone',
    },
    {
      id: 'capture_phone',
      botMessage: (c) => `Thanks *${c.userName || 'there'}*! 📱\n\nBest number to reach you?`,
      inputField: { placeholder: 'Your phone number', key: 'userPhone' },
      nextStep: 'capture_email',
    },
    {
      id: 'capture_email',
      botMessage: `Email? (No worries if you'd rather skip)`,
      inputField: { placeholder: 'your@email.com', key: 'userEmail' },
      nextStep: 'action_choice',
    },
    {
      id: 'action_choice',
      botMessage: (c) => `Almost there! What works best for you?`,
      type: 'buttons',
      buttons: [
        { id: 'buy', label: '✓ Complete order', value: 'purchase' },
        { id: 'agent', label: '👤 Talk to someone', value: 'agent' },
        { id: 'quote', label: '💰 Get quote', value: 'quote' },
      ],
      nextStep: 'complete',
    },
    {
      id: 'complete',
      botMessage: (c) => `Done! ✓\n\nYour request has been sent to *${c.companyName}*.\n\n👤 *${c.userName || 'You'}*\n📱 *${c.userPhone || 'Provided'}*\n🎯 *Interest:* ${c.userInterest || c.selectedProduct || 'General'}\n\n📍 *Ref:* ${generateRefId()}\n\nYou'll hear from them within 2 hours. Cheers! 👍`,
      type: 'buttons',
      buttons: [
        { id: 'restart', label: '🔄 Start over', value: 'restart' },
        { id: 'done', label: '👋 Done', value: 'done' },
      ],
    },
  ];
}

function getInterestButtons(ctx?: DemoContext): QuickReply[] {
  const industry = ctx?.industry || 'general';
  const maps: Record<string, QuickReply[]> = {
    insurance: [
      { id: 'life', label: '🛡️ Life Cover', value: 'Life Insurance' },
      { id: 'car', label: '🚗 Car', value: 'Car Insurance' },
      { id: 'home', label: '🏠 Home', value: 'Home Insurance' },
      { id: 'bus', label: '💼 Business', value: 'Business Cover' },
    ],
    retail: [
      { id: 'cloth', label: '👗 Clothing', value: 'Clothing' },
      { id: 'shoes', label: '👟 Shoes', value: 'Footwear' },
      { id: 'acc', label: '💍 Accessories', value: 'Accessories' },
      { id: 'home', label: '🏠 Homeware', value: 'Homeware' },
    ],
    finance: [
      { id: 'home', label: '🏠 Home Loan', value: 'Home Loan' },
      { id: 'per', label: '💰 Personal', value: 'Personal Loan' },
      { id: 'biz', label: '🏢 Business', value: 'Business Finance' },
      { id: 'inv', label: '📈 Investment', value: 'Investment' },
    ],
    solar: [
      { id: 'home', label: '🏠 Home', value: 'Home Solar' },
      { id: 'biz', label: '🏢 Commercial', value: 'Commercial Solar' },
      { id: 'bat', label: '🔋 Battery', value: 'Battery Backup' },
      { id: 'maint', label: '🔧 Service', value: 'Maintenance' },
    ],
    general: [
      { id: 'prod', label: '📦 Products', value: 'Products' },
      { id: 'svc', label: '⚙️ Services', value: 'Services' },
      { id: 'quote', label: '💰 Pricing', value: 'Pricing' },
      { id: 'other', label: '❓ Other', value: 'Other' },
    ],
  };
  return maps[industry] || maps.general;
}

function getConnectTopics(ctx?: DemoContext): QuickReply[] {
  const industry = ctx?.industry || 'general';
  const maps: Record<string, QuickReply[]> = {
    insurance: [
      { id: 'cover', label: '🛡️ Coverage', value: 'coverage' },
      { id: 'claim', label: '📝 Claims', value: 'claims' },
      { id: 'price', label: '💰 Pricing', value: 'pricing' },
    ],
    retail: [
      { id: 'prod', label: '🛍️ Products', value: 'products' },
      { id: 'del', label: '🚚 Delivery', value: 'delivery' },
      { id: 'ret', label: '🔄 Returns', value: 'returns' },
    ],
    finance: [
      { id: 'elg', label: '✅ Eligibility', value: 'eligibility' },
      { id: 'rate', label: '📊 Rates', value: 'rates' },
      { id: 'app', label: '📋 Process', value: 'application' },
    ],
    solar: [
      { id: 'sys', label: '⚡ Systems', value: 'sizing' },
      { id: 'sav', label: '💰 Savings', value: 'savings' },
      { id: 'inst', label: '🔧 Install', value: 'installation' },
    ],
    general: [
      { id: 'prod', label: '📦 Products', value: 'products' },
      { id: 'price', label: '💰 Pricing', value: 'pricing' },
      { id: 'supp', label: '🛠️ Support', value: 'support' },
    ],
  };
  return maps[industry] || maps.general;
}

function getIndustryInfo(industry: string, companyName: string): string {
  const info: Record<string, string> = {
    insurance: `We offer solid cover solutions that won't break the bank. Policies start from R199/month, same-day activation, and 24/7 support via WhatsApp.`,
    retail: `Browse 1000+ products, free delivery on orders over R500, 30-day easy returns, and exclusive member discounts right here.`,
    finance: `We get you sorted fast. Competitive rates from 9.25% p.a., quick approvals (as fast as 2 hours), and flexible terms.`,
    solar: `Premium solar setups from Tier 1 panels, full installation, 25-year warranty, and smart monitoring. Finance options available too.`,
    general: `Industry-leading products & services, expert team available 7 days a week, trusted by thousands, and competitive pricing guaranteed.`,
  };
  return info[industry] || info.general;
}
