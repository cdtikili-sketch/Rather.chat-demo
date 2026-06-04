import React, { useState, useEffect, useRef } from 'react';
import { Message, QuickReply, CarouselItem, DemoContext, FlowStep } from '../types';
import { ChevronLeft, ChevronRight, ChevronDown, Check, CheckCheck, Phone, Video, MoreVertical, Search, Smile, Paperclip, Mic, Send } from 'lucide-react';

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

function CarouselCard({ item, onAction }: { item: CarouselItem; onAction: (action: string, title: string) => void }) {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative h-36 bg-gray-200 overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        {item.price && (
          <span className="absolute top-2 right-2 bg-[#25D366] text-white text-xs font-bold px-2 py-1 rounded-full">
            {item.price}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-800 text-sm leading-tight">{item.title}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-snug">{item.subtitle}</p>
        <div className="mt-2 flex gap-1.5 flex-wrap">
          {item.buttons.map((btn) => (
            <button
              key={btn.action}
              onClick={() => onAction(btn.action, item.title)}
              className="flex-1 min-w-0 text-xs font-medium text-[#128C7E] border border-[#128C7E] rounded-lg py-1.5 px-2 hover:bg-[#128C7E] hover:text-white transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onButtonClick, onCarouselAction }: {
  msg: Message;
  onButtonClick: (value: string, label: string) => void;
  onCarouselAction: (action: string, title: string) => void;
}) {
  const isBot = msg.role === 'bot';
  const [carouselIndex, setCarouselIndex] = useState(0);

  if (msg.type === 'typing') {
    return (
      <div className="flex items-end gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          RC
        </div>
        <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-3 ${isBot ? 'items-start' : 'items-end'}`}>
      {isBot && (
        <div className="flex items-end gap-2 mb-1 w-full">
          <div className="w-7 h-7 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            RC
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-xs">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
              <p className="text-right text-gray-400 text-xs mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        </div>
      )}

      {!isBot && (
        <div className="flex items-end gap-1">
          <div className="bg-[#DCF8C6] rounded-2xl rounded-tr-none px-4 py-3 shadow-sm max-w-xs">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <p className="text-gray-400 text-xs">{formatTime(msg.timestamp)}</p>
              <CheckCheck className="w-3 h-3 text-[#4FC3F7]" />
            </div>
          </div>
        </div>
      )}

      {isBot && msg.type === 'carousel' && msg.carousel && (
        <div className="ml-9 w-full mt-1">
          <div className="relative">
            <div className="flex gap-3 overflow-hidden">
              <div className="flex gap-3 transition-transform duration-300" style={{ transform: `translateX(-${carouselIndex * (272)}px)` }}>
                {msg.carousel.map((item) => (
                  <CarouselCard key={item.id} item={item} onAction={onCarouselAction} />
                ))}
              </div>
            </div>
            {carouselIndex > 0 && (
              <button onClick={() => setCarouselIndex(i => i - 1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white rounded-full p-1 shadow-md border">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            )}
            {msg.carousel && carouselIndex < msg.carousel.length - 1 && (
              <button onClick={() => setCarouselIndex(i => i + 1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white rounded-full p-1 shadow-md border">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex justify-center gap-1 mt-2">
            {msg.carousel.map((_, i) => (
              <button key={i} onClick={() => setCarouselIndex(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === carouselIndex ? 'bg-[#128C7E]' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
      )}

      {isBot && msg.type === 'buttons' && msg.buttons && (
        <div className="ml-9 mt-2 w-full max-w-sm">
          {msg.buttons.length <= 3 ? (
            // Meta Interactive Reply Buttons (≤3)
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {msg.buttons.map((btn, idx) => (
                <button
                  key={btn.id}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-[#128C7E] hover:bg-[#f0f0f0] transition-colors flex items-center justify-between group"
                  style={{ borderBottom: idx < msg.buttons!.length - 1 ? '1px solid #e0e0e0' : 'none' }}
                >
                  <span>{btn.label}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#128C7E] transition-colors" style={{ transform: 'rotate(-90deg)' }} />
                </button>
              ))}
            </div>
          ) : (
            // Meta Interactive List Message (>3)
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm max-h-64 overflow-y-auto">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Select an option</p>
              </div>
              {msg.buttons.map((btn, idx) => (
                <button
                  key={btn.id}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-[#1B1F4A] hover:bg-[#f5f5f5] transition-colors flex items-center justify-between group"
                  style={{ borderBottom: idx < msg.buttons!.length - 1 ? '1px solid #f0f0f0' : 'none' }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full border-2 border-[#128C7E] group-hover:bg-[#128C7E]" />
                    <span>{btn.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-[#128C7E] transition-colors" style={{ transform: 'rotate(-90deg)' }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatText(text: string): string {
  return text
    .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

export default function WhatsAppDemo({
  messages, onUserReply, onTextInput, inputFieldConfig, isTyping, companyName, disabled
}: WhatsAppDemoProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onTextInput(inputValue.trim());
    setInputValue('');
  };

  const handleCarouselAction = (action: string, title: string) => {
    onUserReply(action, title);
  };

  const handleButtonClick = (value: string, label: string) => {
    if (!disabled) onUserReply(value, label);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-900 p-2 sm:p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-sm aspect-[9/19.5] bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col border-8 border-gray-800 relative">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10 border-b border-gray-700" />

        {/* Phone Content */}
        <div className="flex flex-col h-full bg-[#ECE5DD] font-sans overflow-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c9d1c8\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
          {/* Status Bar */}
          <div className="bg-[#ECE5DD] px-4 py-1 flex items-center justify-between text-xs font-semibold text-gray-700 border-b border-gray-300">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-700 rounded-full" />
              <div className="w-1 h-1 bg-gray-700 rounded-full" />
              <div className="w-2 h-1.5 border border-gray-700 rounded-sm" />
            </div>
          </div>

          {/* Header */}
          <div className="bg-[#128C7E] px-4 py-3 flex items-center gap-3 shadow-md">
            <button className="text-white/80 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm leading-tight">{companyName}</p>
              <p className="text-green-200 text-xs">Online · WhatsApp Business</p>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <Video className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="text-center mb-4">
              <span className="bg-[#DCF8C6] text-[#128C7E] text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-[#25D366]/20">
                🔒 Messages are end-to-end encrypted
              </span>
            </div>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onButtonClick={handleButtonClick}
                onCarouselAction={handleCarouselAction}
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

          {/* Input */}
          <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2 border-t border-gray-300">
            <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-gray-200">
              <Smile className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={inputFieldConfig ? inputFieldConfig.placeholder : 'Type a message...'}
                disabled={disabled || (!inputFieldConfig && messages.length > 0)}
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent disabled:opacity-50"
              />
              <Paperclip className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
            {inputValue.trim() ? (
              <button onClick={handleSend} className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center shadow-md hover:bg-[#0a7a6e] transition-colors flex-shrink-0">
                <Send className="w-5 h-5 text-white" />
              </button>
            ) : (
              <button className="w-10 h-10 bg-[#128C7E] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <Mic className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {inputFieldConfig && (
            <div className="bg-white border-t border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-400 text-center">Type your response above and press Enter or the send button</p>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-black flex items-end justify-center pb-1">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
