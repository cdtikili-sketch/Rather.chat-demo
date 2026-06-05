import React, { useState, useEffect, useRef } from 'react';
import { Message, QuickReply, CarouselItem, DemoContext, FlowStep } from '../types';
import {
  ChevronLeft, ChevronRight, ChevronDown, CheckCheck,
  Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send,
} from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface WhatsAppDemoProps {
  messages: Message[];
  onUserReply: (value: string, label: string) => void;
  onTextInput: (text: string) => void;
  inputFieldConfig?: { placeholder: string; key: string } | null;
  isTyping: boolean;
  companyName: string;
  companyAvatar?: string;
  disabled?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatText(text: string): string {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

// ─── Carousel card ────────────────────────────────────────────────────────────

function CarouselCard({
  item,
  onAction,
}: {
  item: CarouselItem;
  onAction: (action: string, title: string) => void;
}) {
  return (
    <div className="flex-shrink-0 w-60 bg-white rounded-2xl overflow-hidden border border-gray-100/80 shadow-sm">
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        {item.price && (
          <span className="absolute top-2 right-2 bg-[#25D366] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
            {item.price}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-[13px] leading-snug">{item.title}</p>
        <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">{item.subtitle}</p>
        <div className="mt-2.5 flex gap-1.5 flex-wrap">
          {item.buttons.map((btn) => (
            <button
              key={btn.action}
              onClick={() => onAction(btn.action, item.title)}
              className="flex-1 min-w-0 text-[12px] font-semibold text-[#128C7E] border border-[#128C7E] rounded-xl py-1.5 px-2 hover:bg-[#128C7E] hover:text-white transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  onButtonClick,
  onCarouselAction,
  disabled,
}: {
  msg: Message;
  onButtonClick: (value: string, label: string) => void;
  onCarouselAction: (action: string, title: string) => void;
  disabled?: boolean;
}) {
  const isBot = msg.role === 'bot';
  const [carouselIndex, setCarouselIndex] = useState(0);

  if (msg.type === 'typing') {
    return (
      <div className="flex items-end gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
          RC
        </div>
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100/60">
          <div className="flex gap-1 items-center h-4">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-1.5 ${isBot ? 'items-start' : 'items-end'}`}>

      {/* Bot bubble */}
      {isBot && (
        <div className="flex items-end gap-2 w-full">
          <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm">
            RC
          </div>
          <div
            className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-100/60"
            style={{ maxWidth: 'calc(100% - 2.5rem)' }}
          >
            <p
              className="text-gray-800 text-[13px] leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
            />
            <p className="text-right text-gray-400 text-[10px] mt-1">{formatTime(msg.timestamp)}</p>
          </div>
        </div>
      )}

      {/* User bubble */}
      {!isBot && (
        <div
          className="bg-[#DCF8C6] rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-sm"
          style={{ maxWidth: 'calc(100% - 1rem)' }}
        >
          <p className="text-gray-800 text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <p className="text-gray-400 text-[10px]">{formatTime(msg.timestamp)}</p>
            <CheckCheck className="w-3 h-3 text-[#53BDEB]" />
          </div>
        </div>
      )}

      {/* Carousel */}
      {isBot && msg.type === 'carousel' && msg.carousel && (
        <div className="ml-9 w-full mt-1.5">
          <div className="relative overflow-hidden">
            <div
              className="flex gap-2.5 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 256}px)` }}
            >
              {msg.carousel.map((item) => (
                <CarouselCard key={item.id} item={item} onAction={onCarouselAction} />
              ))}
            </div>
            {carouselIndex > 0 && (
              <button
                onClick={() => setCarouselIndex((i) => i - 1)}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-1 shadow-md border border-gray-100"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {msg.carousel && carouselIndex < msg.carousel.length - 1 && (
              <button
                onClick={() => setCarouselIndex((i) => i + 1)}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-1 shadow-md border border-gray-100"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {msg.carousel.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`transition-all rounded-full ${
                  i === carouselIndex ? 'bg-[#128C7E] w-4 h-1.5' : 'bg-gray-300 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Buttons / List */}
      {isBot && msg.type === 'buttons' && msg.buttons && (
        <div className="ml-9 mt-1.5 w-full" style={{ maxWidth: 'calc(100% - 2.5rem)' }}>
          {msg.buttons.length <= 3 ? (
            // Meta Interactive Reply Buttons (<=3)
            <div className="flex flex-col gap-1.5">
              {msg.buttons.map((btn) => (
                <button
                  key={btn.id}
                  disabled={disabled}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full bg-white/90 rounded-2xl border border-[#128C7E]/30 px-4 py-2.5 text-[13px] font-semibold text-[#128C7E] hover:bg-[#128C7E] hover:text-white hover:border-[#128C7E] active:scale-[0.98] transition-all shadow-sm text-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          ) : (
            // Meta Interactive List Message (>3)
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Select an option</p>
              </div>
              {msg.buttons.map((btn, idx) => (
                <button
                  key={btn.id}
                  disabled={disabled}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full text-left px-4 py-3 text-[13px] font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-3 group disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderBottom: idx < msg.buttons!.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-[#128C7E] flex-shrink-0 group-hover:bg-[#128C7E] transition-colors" />
                  <span className="flex-1">{btn.label}</span>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#128C7E] transition-colors flex-shrink-0"
                    style={{ transform: 'rotate(-90deg)' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Phone frame ──────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full max-w-[340px] mx-auto select-none">
      {/* Side buttons */}
      <div className="absolute left-[-3px] top-[96px]  w-[3px] h-[28px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[136px] w-[3px] h-[46px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute left-[-3px] top-[192px] w-[3px] h-[46px] bg-[#2a2a2a] rounded-l-sm" />
      <div className="absolute right-[-3px] top-[158px] w-[3px] h-[62px] bg-[#2a2a2a] rounded-r-sm" />

      {/* Outer shell */}
      <div
        className="rounded-[52px] p-1"
        style={{
          background: 'linear-gradient(160deg,#2e2e2e 0%,#1a1a1a 60%,#111 100%)',
          boxShadow: '0 0 0 0.5px #3c3c3c, 0 32px 72px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      >
        {/* Inner bezel */}
        <div className="rounded-[46px] overflow-hidden bg-black">
          {/* Dynamic island */}
          <div className="relative bg-black h-0">
            <div
              className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20"
              style={{
                width: 108,
                height: 32,
                background: '#000',
                borderRadius: 20,
              }}
            />
          </div>
          {children}
        </div>
      </div>

      {/* Screen reflections */}
      <div
        className="absolute inset-[5px] rounded-[47px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
          zIndex: 30,
        }}
      />
    </div>
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div
      className="flex items-end justify-between px-7 pb-1 flex-shrink-0"
      style={{ paddingTop: 48, background: '#075E54' }}
    >
      <span className="text-white text-[13px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <div className="flex items-end gap-[2px]">
          {[4, 7, 10, 13].map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-sm"
              style={{ height: h, background: i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}
            />
          ))}
        </div>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <path d="M8 3C10.4 3 12.5 4 13.9 5.6L15.3 4.2C13.5 2.2 11 1 8 1C5 1 2.5 2.2.7 4.2L2.1 5.6C3.5 4 5.6 3 8 3Z" fill="white" fillOpacity=".9"/>
          <path d="M8 6C9.5 6 10.9 6.6 11.9 7.6L13.3 6.2C12 4.9 10.1 4 8 4C5.9 4 4 4.9 2.7 6.2L4.1 7.6C5.1 6.6 6.5 6 8 6Z" fill="white" fillOpacity=".9"/>
          <circle cx="8" cy="11" r="1.5" fill="white" fillOpacity=".9"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="w-[22px] h-[11px] border border-white/70 rounded-[3px] p-[1.5px] flex items-center">
            <div className="h-full rounded-[1px] bg-[#4caf50]" style={{ width: '65%' }} />
          </div>
          <div className="w-[2px] h-[5px] bg-white/50 rounded-r-sm ml-px" />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function WhatsAppDemo({
  messages,
  onUserReply,
  onTextInput,
  inputFieldConfig,
  isTyping,
  companyName,
  disabled,
}: WhatsAppDemoProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputEnabled = !!inputFieldConfig && !disabled;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const val = inputValue.trim();
    if (!val || !inputEnabled) return;
    onTextInput(val);
    setInputValue('');
  };

  const initial = companyName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-center h-full w-full bg-[#0f1419] p-3 sm:p-5">
      <PhoneFrame>
        {/* WhatsApp UI */}
        <div
          className="flex flex-col"
          style={{
            height: '100%',
            minHeight: 640,
            fontFamily: '-apple-system, "SF Pro Text", sans-serif',
            background: '#ECE5DD',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b2bdb1' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        >
          {/* Status bar */}
          <StatusBar />

          {/* Chat header */}
          <div className="bg-[#075E54] px-3 pb-2.5 flex items-center gap-2.5 flex-shrink-0">
            <button className="p-0.5 text-white/75 hover:text-white" aria-label="Back">
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar */}
            <div
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0 border-2 border-white/20 shadow-inner"
              style={{ background: 'linear-gradient(135deg,#1a9f8f,#0d6e63)' }}
            >
              {initial}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-[14px] leading-tight truncate">{companyName}</p>
              <p className="text-[#b2dfdb] text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block" />
                Online · WhatsApp Business
              </p>
            </div>

            <div className="flex items-center gap-3.5 text-white/80 flex-shrink-0">
              <Video className="w-[18px] h-[18px]" />
              <Phone className="w-[17px] h-[17px]" />
              <MoreVertical className="w-[18px] h-[18px]" />
            </div>
          </div>

          {/* Date chip */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <span
              className="text-[11px] text-gray-500 px-3 py-[3px] rounded-full shadow-sm"
              style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(4px)' }}
            >
              Today
            </span>
          </div>

          {/* Encryption notice */}
          <div className="flex justify-center mb-2 px-4 flex-shrink-0">
            <span
              className="text-[11px] text-center text-[#5a7a6e] px-3 py-1.5 rounded-xl leading-snug"
              style={{ background: 'rgba(255,255,255,0.6)' }}
            >
              Messages are end-to-end encrypted. No one outside of this chat can read them.
            </span>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onButtonClick={(v, l) => { if (!disabled) onUserReply(v, l); }}
                onCarouselAction={(a, t) => { if (!disabled) onUserReply(a, t); }}
                disabled={disabled}
              />
            ))}
            {isTyping && (
              <MessageBubble
                msg={{ id: 'typing', role: 'bot', content: '', timestamp: new Date(), type: 'typing' }}
                onButtonClick={() => {}}
                onCarouselAction={() => {}}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input hint when text input is active */}
          {inputFieldConfig && (
            <div className="bg-white/60 border-t border-gray-200/60 px-4 py-1.5 flex-shrink-0">
              <p className="text-[11px] text-gray-400 text-center">
                Type your response and press Enter or tap send
              </p>
            </div>
          )}

          {/* Input bar */}
          <div className="bg-[#F0F2F5] px-2.5 py-2 flex items-center gap-2 border-t border-gray-200/60 flex-shrink-0">
            <div
              className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-full border border-gray-200 shadow-sm"
              style={{ background: '#fff' }}
            >
              <Smile className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={inputFieldConfig ? inputFieldConfig.placeholder : 'Message'}
                disabled={!inputEnabled}
                className="flex-1 outline-none text-[13px] text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-40 min-w-0"
              />
              {!inputEnabled && <Paperclip className="w-[18px] h-[18px] text-gray-400 flex-shrink-0" />}
            </div>

            {inputEnabled && inputValue.trim() ? (
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: '#128C7E' }}
                aria-label="Send"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ background: '#128C7E' }}
                aria-label="Voice message"
              >
                <Mic className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Home indicator */}
          <div className="bg-black h-[22px] flex items-center justify-center flex-shrink-0">
            <div className="w-24 h-1 bg-[#3a3a3c] rounded-full" />
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
