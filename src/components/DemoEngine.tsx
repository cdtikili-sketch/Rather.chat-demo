import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Message, DemoContext, FlowStep, DemoMode } from '../types';
import { getContactFlow, getConvertFlow, getConnectFlow, getMasterFlow } from '../lib/conversationFlows';
import { createDemoSession, saveDemoLead } from '../lib/supabase';
import WhatsAppDemo from './WhatsAppDemo';
import { RefreshCw, Play, Pause, Zap, User } from 'lucide-react';

// South African auto-fill data for demo
const SA_AUTO_FILL = {
  names: ['Thabo Mthembu', 'Lerato Ndlovu', 'Ayanda Sibiya', 'Naledi Mtshali', 'Sipho Khumalo', 'Lindiwe Botha'],
  phones: ['+27 82 123 4567', '+27 73 234 5678', '+27 65 345 6789', '+27 81 456 7890', '+27 71 567 8901', '+27 72 678 9012'],
  emails: ['thabo@email.com', 'lerato@email.com', 'ayanda@email.com', 'naledi@email.com', 'sipho@email.com', 'lindiwe@email.com'],
};

interface DemoEngineProps {
  mode: DemoMode;
  context: DemoContext;
  onReset?: () => void;
  autoMode?: boolean;
  onAutoModeChange?: (enabled: boolean) => void;
  speed?: number;
}

function getFlow(mode: DemoMode, ctx: DemoContext): FlowStep[] {
  switch (mode) {
    case 'contact': return getContactFlow(ctx);
    case 'convert': return getConvertFlow(ctx);
    case 'connect': return getConnectFlow(ctx);
    case 'master': return getMasterFlow(ctx);
  }
}

function resolveMessage(step: FlowStep, ctx: DemoContext): string {
  if (typeof step.botMessage === 'function') return step.botMessage(ctx);
  return step.botMessage;
}

function resolveButtons(step: FlowStep, ctx: DemoContext) {
  if (!step.buttons) return undefined;
  if (typeof step.buttons === 'function') return (step.buttons as (ctx: DemoContext) => any[])(ctx);
  return step.buttons;
}

export default function DemoEngine({ mode, context, onReset, autoMode: externalAutoMode, onAutoModeChange, speed: externalSpeed }: DemoEngineProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [ctx, setCtx] = useState<DemoContext>({ ...context });
  const [isTyping, setIsTyping] = useState(false);
  const [autoMode, setAutoMode] = useState(externalAutoMode ?? false);
  const [waitingInput, setWaitingInput] = useState(false);
  const [inputConfig, setInputConfig] = useState<{ placeholder: string; key: string } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [speed, setSpeed] = useState(externalSpeed ?? 1);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize flows to avoid re-computation on every render
  const flows = useMemo(() => getFlow(mode, ctx), [mode, ctx]);

  const currentStep = flows[currentStepIndex] || null;

  useEffect(() => {
    (async () => {
      const session = await createDemoSession(mode, context.companyName, context.companyUrl, context.industry);
      if (session) setSessionId(session.id);
    })();
    // Always attempt to start the first step (flows check is internal)
    startStep(0, { ...context });
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
  }, [mode, context.companyName]);

  const addBotMessage = (step: FlowStep, ctxSnap: DemoContext) => {
    const content = resolveMessage(step, ctxSnap);
    const buttons = resolveButtons(step, ctxSnap);
    const id = `bot-${Date.now()}-${Math.random()}`;
    const msg: Message = {
      id,
      role: 'bot',
      content,
      timestamp: new Date(),
      type: step.type || (step.carousel ? 'carousel' : step.buttons ? 'buttons' : 'text'),
      buttons: buttons,
      carousel: step.carousel,
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const startStep = (idx: number, ctxSnap: DemoContext) => {
    if (idx >= flows.length) return;
    setCurrentStepIndex(idx);
    setIsTyping(true);
    setWaitingInput(false);
    setInputConfig(null);

    const delay = 800 + Math.random() * 600;
    autoTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const step = flows[idx];
      addBotMessage(step, ctxSnap);

      if (step.inputField) {
        setWaitingInput(true);
        setInputConfig(step.inputField);
      }
    }, delay);
  };

  const advanceToNext = useCallback((ctxSnap: DemoContext, currentIdx: number) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < flows.length) {
      setTimeout(() => startStep(nextIdx, ctxSnap), 300);
    }
  }, [flows.length]);

  const handleUserReply = useCallback((value: string, label: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: label,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);

    const newCtx = { ...ctx, selectedProduct: value.startsWith('quote_') || value.startsWith('shop_') || value.startsWith('apply_') ? label : ctx.selectedProduct, userInterest: label };
    setCtx(newCtx);

    advanceToNext(newCtx, currentStepIndex);
  }, [ctx, currentStepIndex, advanceToNext]);

  const handleTextInput = useCallback((text: string) => {
    if (!inputConfig) return;
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text',
    };
    setMessages(prev => [...prev, userMsg]);

    const newCtx = { ...ctx, [inputConfig.key]: text };
    setCtx(newCtx);
    setWaitingInput(false);
    setInputConfig(null);

    if (inputConfig.key === 'userPhone' && sessionId) {
      saveDemoLead(sessionId, {
        name: newCtx.userName || '',
        phone: text,
        email: newCtx.userEmail || '',
        interest: newCtx.userInterest || '',
      });
    }

    advanceToNext(newCtx, currentStepIndex);
  }, [inputConfig, ctx, currentStepIndex, sessionId, advanceToNext]);

  useEffect(() => {
    if (!autoMode || isTyping || waitingInput || !currentStep) return;

    const hasInteraction = currentStep.buttons || currentStep.carousel;
    if (!hasInteraction) return;

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'bot') return;

    const delay = 1500 + Math.random() * 1000;
    autoTimerRef.current = setTimeout(() => {
      if (currentStep.buttons) {
        const btns = resolveButtons(currentStep, ctx) || [];
        if (btns.length > 0) {
          const btn = btns[0];
          handleUserReply(btn.value, btn.label);
        }
      } else if (currentStep.carousel && currentStep.carousel.length > 0) {
        const item = currentStep.carousel[0];
        handleUserReply(item.buttons[0].action, item.title);
      }
    }, delay);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [autoMode, currentStepIndex, messages.length, currentStep, ctx, handleUserReply, isTyping, waitingInput]);

  // Auto-fill text input fields in auto-mode
  useEffect(() => {
    if (!autoMode || !waitingInput || !inputConfig) return;

    const getRandomValue = (field: string): string => {
      const idx = Math.floor(Math.random() * 6);
      switch (field) {
        case 'userName':
          return SA_AUTO_FILL.names[idx];
        case 'userPhone':
          return SA_AUTO_FILL.phones[idx];
        case 'userEmail':
          return SA_AUTO_FILL.emails[idx];
        case 'userIdNumber':
          return `${Math.floor(Math.random() * 90000) + 10000}${Math.floor(Math.random() * 9000) + 1000}`;
        default:
          return '';
      }
    };

    const delay = 1500 + Math.random() * 1000;
    autoTimerRef.current = setTimeout(() => {
      const value = getRandomValue(inputConfig.key);
      if (value) {
        handleTextInput(value);
      }
    }, delay);

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [autoMode, waitingInput, inputConfig, handleTextInput]);

  const handleReset = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    setMessages([]);
    setCurrentStepIndex(0);
    setCtx({ ...context });
    setIsTyping(false);
    setWaitingInput(false);
    setInputConfig(null);
    setAutoMode(false);
    if (onAutoModeChange) onAutoModeChange(false);
    setTimeout(() => startStep(0, { ...context }), 200);
  };

  const handleAutoModeChange = (enabled: boolean) => {
    setAutoMode(enabled);
    if (onAutoModeChange) onAutoModeChange(enabled);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Compact controls bar */}
      <div className="bg-[#128C7E] px-3 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${autoMode ? 'bg-[#25D366] animate-pulse' : 'bg-white/40'}`} />
          <span className="text-xs font-medium text-white/90">{autoMode ? 'Auto' : 'Manual'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleAutoModeChange(!autoMode)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
              autoMode ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#25D366] text-[#044137] hover:bg-[#20c15c]'
            }`}
          >
            {autoMode ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{autoMode ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* WhatsApp UI */}
      <div className="flex-1 overflow-hidden">
        <WhatsAppDemo
          messages={messages}
          onUserReply={handleUserReply}
          onTextInput={handleTextInput}
          inputFieldConfig={waitingInput ? inputConfig : null}
          isTyping={isTyping}
          companyName={ctx.companyName}
          disabled={autoMode || isTyping}
        />
      </div>
    </div>
  );
}
