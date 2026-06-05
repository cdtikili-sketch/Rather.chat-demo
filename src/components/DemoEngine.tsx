import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DemoContext, FlowStep, Message, QuickReply } from "@/types";
import type { DemoMode } from "@/types";
import { getContactFlow, getConvertFlow, getConnectFlow, getMasterFlow } from "@/lib/conversationFlows";
import { createDemoSession, saveDemoLead } from "@/lib/supabase";
import { PhoneScreen } from "./PhoneScreen";

const SA_AUTO_FILL = {
  names: ["Thabo Mthembu", "Lerato Ndlovu", "Ayanda Sibiya", "Naledi Mtshali", "Sipho Khumalo", "Lindiwe Botha"],
  phones: ["+27 82 123 4567", "+27 73 234 5678", "+27 65 345 6789", "+27 81 456 7890", "+27 71 567 8901", "+27 72 678 9012"],
  emails: ["thabo@email.com", "lerato@email.com", "ayanda@email.com", "naledi@email.com", "sipho@email.com", "lindiwe@email.com"],
};

interface DemoEngineProps {
  mode: DemoMode;
  context: DemoContext;
  autoMode: boolean;
  speed?: number;
  onStatsChange?: (s: { botCount: number; userCount: number; progress: number; dataPoints: number }) => void;
}

function getFlowFor(mode: DemoMode, ctx: DemoContext): FlowStep[] {
  switch (mode) {
    case "contact": return getContactFlow(ctx);
    case "convert": return getConvertFlow(ctx);
    case "connect": return getConnectFlow(ctx);
    case "master": return getMasterFlow(ctx);
  }
}

function resolveMessage(step: FlowStep, ctx: DemoContext): string {
  return typeof step.botMessage === "function" ? step.botMessage(ctx) : step.botMessage;
}

function resolveButtons(step: FlowStep, ctx: DemoContext): QuickReply[] | undefined {
  if (!step.buttons) return undefined;
  if (typeof step.buttons === "function") return step.buttons(ctx);
  return step.buttons;
}

export function DemoEngine({ mode, context, autoMode, speed = 1, onStatsChange }: DemoEngineProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [ctx, setCtx] = useState<DemoContext>({ ...context });
  const [isTyping, setIsTyping] = useState(false);
  const [waitingInput, setWaitingInput] = useState(false);
  const [inputConfig, setInputConfig] = useState<{ placeholder: string; key: string } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flows = useMemo(() => getFlowFor(mode, ctx), [mode, ctx]);
  const currentStep = flows[stepIdx] || null;
  const speedFactor = Math.max(0.4, 1 / speed);

  const startStep = useCallback(
    (idx: number, ctxSnap: DemoContext) => {
      if (idx >= flows.length) return;
      setStepIdx(idx);
      setIsTyping(true);
      setWaitingInput(false);
      setInputConfig(null);

      const delay = (800 + Math.random() * 600) * speedFactor;
      timerRef.current = setTimeout(() => {
        setIsTyping(false);
        const step = flows[idx];
        const content = resolveMessage(step, ctxSnap);
        const buttons = resolveButtons(step, ctxSnap);
        const msg: Message = {
          id: `bot-${Date.now()}-${Math.random()}`,
          role: "bot",
          content,
          timestamp: new Date(),
          type: step.type || (step.carousel ? "carousel" : step.buttons ? "buttons" : "text"),
          buttons,
          carousel: step.carousel,
        };
        setMessages((p) => [...p, msg]);

        if (step.inputField) {
          setWaitingInput(true);
          setInputConfig(step.inputField as { placeholder: string; key: string });
        }
      }, delay);
    },
    [flows, speedFactor],
  );

  // Reset when mode or company changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages([]);
    setStepIdx(0);
    const fresh: DemoContext = { ...context };
    setCtx(fresh);

    // Create session for analytics
    createDemoSession(mode, context.companyName, context.companyUrl, context.industry).then((s) => {
      if (s) setSessionId(s.id);
    });

    startStep(0, fresh);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, context.companyName, context.industry]);

  const advance = useCallback(
    (ctxSnap: DemoContext, fromIdx: number) => {
      const next = fromIdx + 1;
      if (next < flows.length) {
        setTimeout(() => startStep(next, ctxSnap), 300 * speedFactor);
      }
    },
    [flows.length, speedFactor, startStep],
  );

  const handleUserReply = useCallback(
    (value: string, label: string) => {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: label,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((p) => [...p, userMsg]);

      const isProductPick = /^(quote|shop|apply|info|enquire)_/.test(value);
      const newCtx: DemoContext = {
        ...ctx,
        selectedProduct: isProductPick ? label : ctx.selectedProduct,
        userInterest: label,
      };
      setCtx(newCtx);
      advance(newCtx, stepIdx);
    },
    [ctx, stepIdx, advance],
  );

  const handleTextInput = useCallback(
    (text: string) => {
      if (!inputConfig) return;
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((p) => [...p, userMsg]);

      const newCtx: DemoContext = { ...ctx, [inputConfig.key]: text };
      setCtx(newCtx);
      setWaitingInput(false);
      setInputConfig(null);

      // Save lead data when we get a phone number
      if (inputConfig.key === "userPhone" && sessionId) {
        saveDemoLead(sessionId, {
          name: newCtx.userName || "",
          phone: text,
          email: newCtx.userEmail || "",
          interest: newCtx.userInterest || "",
        });
      }

      advance(newCtx, stepIdx);
    },
    [inputConfig, ctx, stepIdx, advance, sessionId],
  );

  // Auto-mode: auto-click buttons / carousel
  useEffect(() => {
    if (!autoMode || isTyping || waitingInput || !currentStep) return;
    const hasInteraction = !!(currentStep.buttons || currentStep.carousel);
    if (!hasInteraction) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "bot") return;

    const delay = (1400 + Math.random() * 900) * speedFactor;
    timerRef.current = setTimeout(() => {
      if (currentStep.buttons) {
        const btns = resolveButtons(currentStep, ctx) || [];
        if (btns.length > 0) {
          const btn = btns[Math.floor(Math.random() * Math.min(2, btns.length))];
          handleUserReply(btn.value, btn.label);
        }
      } else if (currentStep.carousel && currentStep.carousel.length > 0) {
        const item = currentStep.carousel[0];
        handleUserReply(item.buttons[0].action, item.title);
      }
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoMode, stepIdx, messages.length, currentStep, ctx, handleUserReply, isTyping, waitingInput, speedFactor]);

  // Auto-mode: auto-fill text inputs
  useEffect(() => {
    if (!autoMode || !waitingInput || !inputConfig) return;
    const getValue = (field: string) => {
      const i = Math.floor(Math.random() * 6);
      switch (field) {
        case "userName": return SA_AUTO_FILL.names[i];
        case "userPhone": return SA_AUTO_FILL.phones[i];
        case "userEmail": return SA_AUTO_FILL.emails[i];
        case "userIdNumber": return `${Math.floor(Math.random() * 90000) + 10000}${Math.floor(Math.random() * 9000) + 1000}1086`;
        default: return "Auto reply";
      }
    };
    const delay = (1400 + Math.random() * 800) * speedFactor;
    timerRef.current = setTimeout(() => {
      handleTextInput(getValue(inputConfig.key));
    }, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoMode, waitingInput, inputConfig, handleTextInput, speedFactor]);

  // Report stats up
  useEffect(() => {
    const botCount = messages.filter((m) => m.role === "bot").length;
    const userCount = messages.filter((m) => m.role === "user").length;
    const progress = Math.min(100, Math.round((stepIdx / Math.max(1, flows.length - 1)) * 100));
    const dataPoints = ["userName", "userPhone", "userEmail", "userIdNumber", "userInterest", "selectedProduct"].filter(
      (k) => !!(ctx as Record<string, string | undefined>)[k],
    ).length;
    onStatsChange?.({ botCount, userCount, progress, dataPoints });
  }, [messages, stepIdx, flows.length, ctx, onStatsChange]);

  return (
    <PhoneScreen
      messages={messages}
      isTyping={isTyping}
      ctx={ctx}
      inputFieldConfig={inputConfig}
      disabled={autoMode}
      onUserReply={handleUserReply}
      onTextInput={handleTextInput}
    />
  );
}
