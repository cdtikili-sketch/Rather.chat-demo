import { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Mic,
  Paperclip,
  Phone,
  Send,
  Smile,
  Video,
} from "lucide-react";
import type { CarouselItem, DemoContext, Message } from "@/types";
import { formatText, formatTime } from "@/lib/utils";

interface Props {
  messages: Message[];
  isTyping: boolean;
  ctx: DemoContext;
  inputFieldConfig?: { placeholder: string; key: string } | null;
  disabled?: boolean;
  onUserReply: (value: string, label: string) => void;
  onTextInput: (text: string) => void;
}

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const upd = () =>
      setT(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    upd();
    const id = setInterval(upd, 30_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function CarouselCard({
  item,
  onAction,
}: {
  item: CarouselItem;
  onAction: (action: string, title: string) => void;
}) {
  return (
    <div className="flex-shrink-0 w-[200px] bg-white rounded-xl overflow-hidden shadow-sm border border-black/5">
      <div className="relative h-[100px] bg-gray-100 overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        {item.badge && (
          <span className="absolute top-1.5 left-1.5 bg-[#F77F23] text-white text-[0.55rem] font-extrabold px-1.5 py-[2px] rounded">
            {item.badge}
          </span>
        )}
        {item.price && (
          <span className="absolute bottom-1.5 right-1.5 bg-white/95 text-[#075E54] text-[0.62rem] font-extrabold px-1.5 py-[2px] rounded-md shadow-sm">
            {item.price}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <p className="font-bold text-[0.78rem] text-[#111] leading-tight">{item.title}</p>
        <p className="text-black/55 text-[0.66rem] mt-0.5 leading-snug line-clamp-2">
          {item.subtitle}
        </p>
        <div className="mt-2 flex flex-col gap-1">
          {item.buttons.map((btn, i) => (
            <button
              key={btn.action}
              onClick={() => onAction(btn.action, item.title)}
              className={`w-full text-[0.66rem] font-semibold py-1.5 px-2 rounded transition-colors ${
                i === 0
                  ? "bg-[#00a5f4] text-white hover:bg-[#0095dc]"
                  : "border border-[#00a5f4] text-[#00a5f4] hover:bg-[#f0f9ff]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  const isBot = msg.role === "bot";
  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <div className={`flex flex-col mb-2 ${isBot ? "items-start" : "items-end"}`}>
      {isBot ? (
        <div className="flex items-end gap-1.5 max-w-[88%]">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-black/5">
            <span className="text-[0.5rem] font-extrabold text-[#128C7E]">RC</span>
          </div>
          <div
            className="bg-white px-2.5 py-1.5 shadow-sm"
            style={{ borderRadius: "0 8px 8px 8px", maxWidth: 240 }}
          >
            <p
              className="text-[#111] text-[0.78rem] leading-snug whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
            />
            <p className="text-right text-black/40 text-[0.55rem] mt-0.5 tabular-nums">
              {formatTime(msg.timestamp)}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="bg-[#DCF8C6] px-2.5 py-1.5 shadow-sm max-w-[80%]"
          style={{ borderRadius: "8px 0 8px 8px" }}
        >
          <p className="text-[#111] text-[0.78rem] leading-snug whitespace-pre-wrap break-words">
            {msg.content}
          </p>
          <div className="flex items-center justify-end gap-0.5 mt-0.5">
            <span className="text-black/40 text-[0.55rem] tabular-nums">
              {formatTime(msg.timestamp)}
            </span>
            <CheckCheck className="w-3 h-3 text-[#34B7F1]" />
          </div>
        </div>
      )}

      {isBot && msg.type === "carousel" && msg.carousel && (
        <div className="ml-7 w-full mt-1.5">
          <div className="text-[0.55rem] tracking-[0.08em] text-black/40 mb-1 font-mono px-1">
            CAROUSEL · {msg.carousel.length} CARDS
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex gap-2 transition-transform duration-300"
                style={{ transform: `translateX(-${carouselIndex * 208}px)` }}
              >
                {msg.carousel.map((item) => (
                  <CarouselCard key={item.id} item={item} onAction={onCarouselAction} />
                ))}
              </div>
            </div>
            {carouselIndex > 0 && (
              <button
                onClick={() => setCarouselIndex((i) => i - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white rounded-full p-1 shadow-md border border-black/10"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
              </button>
            )}
            {carouselIndex < msg.carousel.length - 1 && (
              <button
                onClick={() => setCarouselIndex((i) => i + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white rounded-full p-1 shadow-md border border-black/10"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
              </button>
            )}
          </div>
          <div className="flex justify-center gap-1 mt-1.5">
            {msg.carousel.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`h-1 rounded-full transition-all ${
                  i === carouselIndex ? "w-3 bg-[#128C7E]" : "w-1 bg-black/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {isBot && msg.type === "buttons" && msg.buttons && msg.buttons.length > 0 && (
        <div className="ml-7 mt-1.5 w-full max-w-[260px]">
          {msg.buttons.length <= 3 ? (
            <div className="bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm">
              {msg.buttons.map((btn, idx) => (
                <button
                  key={btn.id}
                  disabled={disabled}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full text-center px-3 py-2 text-[0.78rem] font-medium text-[#00a5f4] hover:bg-[#f5fbff] transition-colors disabled:cursor-default disabled:opacity-60"
                  style={{
                    borderTop: idx > 0 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden border border-black/5 shadow-sm">
              <div className="px-3 py-1.5 bg-black/[0.03] border-b border-black/5">
                <p className="text-[0.55rem] font-bold text-black/50 uppercase tracking-wider">
                  Select an option
                </p>
              </div>
              {msg.buttons.map((btn, idx) => (
                <button
                  key={btn.id}
                  disabled={disabled}
                  onClick={() => onButtonClick(btn.value, btn.label)}
                  className="w-full text-left px-3 py-2 text-[0.78rem] font-medium text-[#1B1F4A] hover:bg-black/[0.04] transition-colors flex items-center justify-between disabled:cursor-default disabled:opacity-60"
                  style={{
                    borderTop: idx > 0 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <span>{btn.label}</span>
                  <span className="text-black/30 text-xs">&#8250;</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PhoneScreen({
  messages,
  isTyping,
  ctx,
  inputFieldConfig,
  disabled,
  onUserReply,
  onTextInput,
}: Props) {
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const clock = useClock();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    onTextInput(inputValue.trim());
    setInputValue("");
  };

  const initials = (ctx.companyName || "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden" style={{ borderRadius: 32 }}>
      {/* Dynamic Island */}
      <div className="relative h-0">
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1.5 bg-black z-30"
          style={{ width: 92, height: 24, borderRadius: 999 }}
        />
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 pt-2.5 pb-1 flex-shrink-0"
        style={{ background: "#1F2C34" }}
      >
        <span
          className="text-[0.72rem] font-semibold text-white tabular-nums"
          suppressHydrationWarning
        >
          {clock}
        </span>
        <div className="flex items-center gap-1 text-white">
          <svg width="14" height="9" viewBox="0 0 15 10" fill="currentColor">
            <rect x="0" y="7" width="2.5" height="3" rx="0.5" />
            <rect x="3.5" y="5" width="2.5" height="5" rx="0.5" />
            <rect x="7" y="2.5" width="2.5" height="7.5" rx="0.5" />
            <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" />
          </svg>
          <span className="text-[0.55rem] font-bold">5G</span>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
            <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" opacity="0.5" />
            <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor" />
            <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* WA header */}
      <div
        className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ background: "#128C7E" }}
      >
        <ChevronLeft className="w-4 h-4 text-white/80 flex-shrink-0" />
        {ctx.logo ? (
          <img
            src={ctx.logo}
            alt=""
            className="h-9 w-9 rounded-full object-cover flex-shrink-0 bg-white"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-[0.72rem] font-extrabold text-white flex-shrink-0"
            style={{ background: ctx.accent || "#25D366" }}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white text-[0.85rem] font-semibold truncate">{ctx.companyName}</div>
          <div className="text-white/75 text-[0.6rem] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            {isTyping ? "typing\u2026" : "business \u00b7 online"}
          </div>
        </div>
        <Video className="w-4 h-4 text-white/85 flex-shrink-0" />
        <Phone className="w-4 h-4 text-white/85 flex-shrink-0" />
      </div>

      {/* Chat area */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2"
        style={{
          background: "#ECE5DD",
          backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <div className="text-center my-1.5">
          <span
            className="rounded-md px-2 py-[2px] text-[0.55rem] text-black/45 font-mono"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            TODAY · ENCRYPTED
          </span>
        </div>
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            msg={m}
            disabled={disabled}
            onButtonClick={(v, l) => !disabled && onUserReply(v, l)}
            onCarouselAction={(v, l) => !disabled && onUserReply(v, l)}
          />
        ))}
        {isTyping && (
          <div className="flex items-end gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden ring-1 ring-black/5">
              <span className="text-[0.5rem] font-extrabold text-[#128C7E]">RC</span>
            </div>
            <div
              className="bg-white px-3 py-2 shadow-sm flex items-center gap-1"
              style={{ borderRadius: "0 8px 8px 8px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-1.5 px-2 py-1.5 flex-shrink-0"
        style={{ background: "#f0f0f0" }}
      >
        <div className="flex-1 flex items-center bg-white rounded-full px-2 py-1 gap-1.5">
          <Smile className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              disabled
                ? "Auto simulation running\u2026"
                : inputFieldConfig?.placeholder || "Type a message"
            }
            disabled={disabled || !inputFieldConfig}
            className="flex-1 bg-transparent text-[0.78rem] text-black outline-none disabled:opacity-60 min-w-0"
          />
          <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </div>
        {inputValue.trim() ? (
          <button
            type="submit"
            className="h-8 w-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "#128C7E" }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            className="h-8 w-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: "#128C7E" }}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    </div>
  );
}
