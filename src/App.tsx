import { useCallback, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Globe,
  MessageCircle,
  Pause,
  PhoneCall,
  Play,
  RefreshCw,
  Shield,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { CompanyInput, type CompanySubmit } from "./components/CompanyInput";
import { DemoEngine } from "./components/DemoEngine";
import type { DemoContext, DemoMode } from "./types";

const DEMO_MODES: {
  id: DemoMode;
  label: string;
  tagline: string;
  description: string;
  color: string;
  Icon: typeof PhoneCall;
}[] = [
  { id: "contact", label: "CONTACT", tagline: "Capture & Qualify Leads", description: "Capture lead details via WhatsApp from Meta Ads or website traffic.", color: "from-blue-600 to-blue-500", Icon: PhoneCall },
  { id: "connect", label: "CONNECT", tagline: "Engage & Advise", description: "Keep customers engaged with quotes and expert knowledge.", color: "from-teal-600 to-teal-500", Icon: Users },
  { id: "convert", label: "CONVERT", tagline: "Close Sales on WhatsApp", description: "Complete purchases, policies and subs directly in WhatsApp.", color: "from-green-600 to-green-500", Icon: ShoppingCart },
  { id: "master", label: "MASTER DEMO", tagline: "All Three Solutions in One", description: "Contact \u2192 Connect \u2192 Convert end-to-end workflow.", color: "from-[#075E54] to-[#128C7E]", Icon: Zap },
];

const STATS = [
  { value: "17M+", label: "SA Reach", Icon: Globe },
  { value: "300M+", label: "Messages", Icon: MessageCircle },
  { value: "85%", label: "AI Sales", Icon: Target },
  { value: "60%", label: "Conv. Uplift", Icon: TrendingUp },
];

const FEATURES = [
  { Icon: Shield, label: "Meta Verified Tech Partner" },
  { Icon: CheckCircle2, label: "WhatsApp Business API" },
  { Icon: BarChart3, label: "End-to-end Encrypted" },
];

export default function App() {
  const [selectedMode, setSelectedMode] = useState<DemoMode>("master");
  const [showDemo, setShowDemo] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [demoKey, setDemoKey] = useState(0);
  const [ctx, setCtx] = useState<DemoContext>({
    companyName: "rather.chat",
    companyUrl: "rather.chat",
    industry: "general",
  });
  const [stats, setStats] = useState({ botCount: 0, userCount: 0, progress: 0, dataPoints: 0 });

  const handleGenerate = (data: CompanySubmit) => {
    setIsGenerating(true);
    setTimeout(() => {
      setCtx({
        companyName: data.companyName,
        companyUrl: data.companyUrl,
        industry: data.industry,
        accent: data.accent,
        logo: data.logo,
      });
      setDemoKey((k) => k + 1);
      setShowDemo(true);
      setAutoMode(false);
      setIsGenerating(false);
    }, 900);
  };

  const handleReset = () => {
    setDemoKey((k) => k + 1);
    setAutoMode(false);
  };

  const onStatsChange = useCallback(
    (s: { botCount: number; userCount: number; progress: number; dataPoints: number }) => {
      setStats(s);
    },
    [],
  );

  // ════════════ DEMO MODAL ════════════
  if (showDemo) {
    const mode = DEMO_MODES.find((d) => d.id === selectedMode)!;
    const journey = [
      { step: 1, label: "Trigger", desc: "Meta ad / website CTA" },
      { step: 2, label: "Opt-in", desc: "User taps WhatsApp" },
      { step: 3, label: "Qualify", desc: "Name / phone / intent" },
      { step: 4, label: "Conversion", desc: "Quote / handoff / sale" },
    ];

    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#FAF8F2" }}>
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2 gap-3 flex-shrink-0"
          style={{ background: "#FAF8F2", borderBottom: "1px solid rgba(64,170,52,0.18)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowDemo(false)}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#075E54] to-[#128C7E] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              RC
            </div>
            <div className="hidden md:block border-l pl-3 ml-1" style={{ borderColor: "rgba(10,31,68,0.12)" }}>
              <p className="text-[0.7rem] font-bold text-[#0A1F44] truncate">{ctx.companyName}</p>
              <p className="text-[0.6rem] text-gray-500 uppercase tracking-wider">{selectedMode}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-wrap justify-end">
            {DEMO_MODES.map((dm) => {
              const active = selectedMode === dm.id;
              return (
                <button
                  key={dm.id}
                  onClick={() => {
                    setSelectedMode(dm.id);
                    setDemoKey((k) => k + 1);
                  }}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[0.7rem] font-bold uppercase tracking-wider transition-all ${
                    active
                      ? "bg-[#40aa34] text-white shadow"
                      : "bg-black/5 text-gray-700 hover:bg-black/10"
                  }`}
                >
                  <dm.Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{dm.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowDemo(false)}
            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT SIDEBAR */}
          <aside
            className="hidden lg:flex w-72 overflow-y-auto flex-col p-4 space-y-3 flex-shrink-0 bg-white"
            style={{ borderRight: "1px solid rgba(27,31,74,0.08)" }}
          >
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] text-gray-500 uppercase tracking-wider mb-2 font-bold">Current Demo</p>
              <div className="flex items-center gap-2 mb-2">
                {ctx.logo ? (
                  <img src={ctx.logo} alt="" className="w-9 h-9 rounded-lg object-cover bg-white" />
                ) : (
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: ctx.accent || "#40aa34" }}
                  >
                    {ctx.companyName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{ctx.companyName}</p>
                  <p className="text-xs text-gray-500 truncate">{ctx.companyUrl}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-[#40aa34]/10 text-[#40aa34] border border-[#40aa34]/20 font-semibold uppercase">
                  {ctx.industry}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] font-bold text-gray-500 uppercase tracking-wider mb-2">Simulation</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setAutoMode(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    autoMode ? "bg-[#40aa34] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Play className="w-3 h-3" /> AUTO
                </button>
                <button
                  onClick={() => setAutoMode(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    !autoMode ? "bg-[#0A1F44] text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Pause className="w-3 h-3" /> MANUAL
                </button>
              </div>
              <label className="text-[0.62rem] text-gray-500 font-semibold uppercase tracking-wider flex justify-between items-center mb-1">
                Speed <span className="text-[#40aa34]">{speed.toFixed(1)}x</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={2.5}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#40aa34]"
              />
              <button
                onClick={handleReset}
                className="mt-3 w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <RefreshCw className="w-3 h-3" /> Restart conversation
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] font-bold text-gray-500 uppercase tracking-wider mb-3">Live Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { n: stats.botCount, l: "Bot msgs", c: "#40aa34" },
                  { n: stats.userCount, l: "User msgs", c: "#0A1F44" },
                  { n: `${stats.progress}%`, l: "Progress", c: "#F77F23" },
                  { n: stats.dataPoints, l: "Data points", c: "#075E54" },
                ].map((s) => (
                  <div key={s.l} className="bg-white rounded-lg p-2 text-center border border-gray-200">
                    <p className="text-xl font-black" style={{ color: s.c }}>{s.n}</p>
                    <p className="text-[0.6rem] text-gray-600 mt-0.5 uppercase tracking-wide">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 rounded-full bg-black/5 overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${stats.progress}%`, background: "linear-gradient(90deg,#40aa34,#00E5A0)" }} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] font-bold text-gray-500 uppercase tracking-wider mb-3">Sales Journey</p>
              <div className="space-y-2.5">
                {journey.map((j, i) => {
                  const done = stats.progress >= ((i + 1) / 4) * 100;
                  const active = i === Math.floor(stats.progress / 25) && !done;
                  return (
                    <div key={j.label} className="flex gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[0.62rem] font-bold flex-shrink-0"
                        style={{
                          background: done ? "#40aa34" : active ? "#F77F23" : "rgba(0,0,0,0.06)",
                          color: done || active ? "white" : "#6B7393",
                        }}
                      >
                        {done ? "\u2713" : j.step}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900">{j.label}</p>
                        <p className="text-[0.65rem] text-gray-600">{j.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CENTER PHONE */}
          <section
            className="flex-1 relative flex items-center justify-center overflow-hidden p-4"
            style={{
              backgroundColor: "#0A1F44",
              backgroundImage: "linear-gradient(180deg, rgba(10,31,68,0.78), rgba(8,20,46,0.96)), url(/Rocket.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none px-4 max-w-md">
              <h2 className="text-xl lg:text-2xl font-black text-white">{mode.label}</h2>
              <p className="text-sm text-[#40aa34] font-semibold mt-0.5">{mode.tagline}</p>
            </div>

            {/* Phone frame */}
            <div
              className="relative z-10 mt-12"
              style={{
                width: 320,
                height: 640,
                background: "#0b0b0b",
                borderRadius: 44,
                padding: 5,
                boxShadow: "0 40px 90px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.08)",
              }}
            >
              <DemoEngine
                key={`${selectedMode}-${demoKey}`}
                mode={selectedMode}
                context={ctx}
                autoMode={autoMode}
                speed={speed}
                onStatsChange={onStatsChange}
              />
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside
            className="hidden xl:flex w-72 overflow-y-auto flex-col p-4 space-y-3 flex-shrink-0 bg-white"
            style={{ borderLeft: "1px solid rgba(27,31,74,0.08)" }}
          >
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] font-bold text-gray-500 uppercase tracking-wider mb-3">Meta API Compliance</p>
              <div className="space-y-2 text-xs">
                {[
                  "Opt-in via WhatsApp button",
                  "24-hour messaging window",
                  "Approved templates only",
                  "POPIA consent before handoff",
                  "STOP keyword honoured",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#40aa34]" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-bold text-gray-900 mb-3">{mode.label} Solution</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#128C7E] font-bold">Use case</span><span className="text-gray-700">{mode.tagline}</span></div>
                <div className="flex justify-between"><span className="text-[#128C7E] font-bold">Trigger</span><span className="text-gray-700">Meta Ad click</span></div>
                <div className="flex justify-between"><span className="text-[#128C7E] font-bold">Avg time</span><span className="text-gray-700">~2-4 min</span></div>
                <div className="flex justify-between"><span className="text-[#128C7E] font-bold">Conversion</span><span className="text-[#40aa34] font-bold">+38%</span></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-[0.62rem] font-bold text-gray-500 uppercase tracking-wider mb-3">Documentation</p>
              <div className="space-y-1.5 text-xs">
                {["Cloud API reference", "Interactive messages", "Catalog & commerce", "Product catalog API"].map((doc) => (
                  <p key={doc} className="flex items-center gap-2 text-gray-700 hover:text-[#128C7E] cursor-pointer transition">
                    <CheckCircle2 className="w-3 h-3 text-[#40aa34] flex-shrink-0" /> {doc}
                  </p>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // ════════════ LANDING ════════════
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Hero */}
      <header
        className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
        style={{
          backgroundImage: "url(/Rocket.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#044137]/85 via-[#075E54]/80 to-[#128C7E]/85" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl shadow-lg border-2 border-white/30 bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-[#25D366]" />
                </div>
                <span className="text-white font-bold text-2xl">rather.chat</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                If you're not conversing,
                <br />
                <span className="text-[#25D366]">you're not converting.</span>
              </h1>
              <p className="mt-6 text-green-100 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered WhatsApp sales solutions. Contact, Connect, and Convert customers in real time — at scale.
              </p>

              <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
                {FEATURES.map((f) => (
                  <span key={f.label} className="flex items-center gap-1.5 text-sm text-green-100 bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-2 rounded-full">
                    <f.Icon className="w-4 h-4 text-[#25D366]" />
                    <span className="hidden sm:inline">{f.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-shrink-0 w-full lg:w-auto">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-5 text-center shadow-lg">
                  <s.Icon className="w-5 h-5 mx-auto text-[#25D366] mb-2" />
                  <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                  <p className="text-green-200 text-xs mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-[#128C7E]/10 text-[#128C7E] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#128C7E]/20">
              <Zap className="w-3 h-3" /> Interactive Live Demos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
              Three Solutions. One Platform. Proven Results.
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Personalise the demo with your client's details, then explore each solution or run the complete Master Demo workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT: Config + Why WhatsApp */}
            <div className="space-y-5">
              <CompanyInput onSubmit={handleGenerate} isLoading={isGenerating} />
              <div className="bg-gradient-to-br from-[#044137] to-[#075E54] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4">Why WhatsApp?</h3>
                <ul className="space-y-2.5 text-sm text-green-100">
                  {[
                    "29M South Africans use WhatsApp",
                    "72% prefer it over phone, SMS, email",
                    "90%+ open/read rates",
                    "5x higher engagement than email",
                    "60% uplift in conversion rates",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <span className="text-[#25D366] font-bold text-lg leading-none">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <a href="mailto:human@rather.chat" className="mt-5 inline-flex items-center gap-2 text-[#25D366] text-sm font-semibold hover:text-green-300">
                  Get started <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* RIGHT: Demo cards + How It Works */}
            <div className="lg:col-span-2 space-y-5">
              {/* 3 Demo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DEMO_MODES.filter((d) => d.id !== "master").map((m) => (
                  <div key={m.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${m.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <m.Icon className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{m.label}</p>
                    <p className="text-gray-600 text-sm mt-2">{m.description}</p>
                    <button
                      onClick={() => {
                        setSelectedMode(m.id);
                        setShowDemo(true);
                      }}
                      className={`mt-5 w-full text-sm font-semibold px-4 py-3 rounded-lg bg-gradient-to-r ${m.color} text-white hover:shadow-lg transition-all`}
                    >
                      Try Demo
                    </button>
                  </div>
                ))}
              </div>

              {/* How It Works */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                <h3 className="font-bold text-gray-900 text-xl mb-6">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#128C7E] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">Enter Client Details</p>
                      <p className="text-gray-600 text-sm mt-1">Provide company name, URL, and industry to personalise the demo.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#128C7E] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">Choose Your Flow</p>
                      <p className="text-gray-600 text-sm mt-1">Select Contact, Connect, Convert, or Master to see it in action.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#128C7E] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">Auto or Manual Mode</p>
                      <p className="text-gray-600 text-sm mt-1">Watch it run automatically or interact manually with the conversation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Demo Card */}
              <div
                className="rounded-xl p-8 text-white relative overflow-hidden shadow-xl"
                style={{ backgroundImage: "url(/Rocket.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#044137]/92 via-[#075E54]/88 to-[#128C7E]/92" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Zap className="w-7 h-7 text-[#25D366]" />
                    </div>
                    <h3 className="font-bold text-2xl">Master Demo</h3>
                  </div>
                  <p className="text-green-100 text-base mb-6 max-w-2xl">
                    Experience the complete Contact, Connect, Convert workflow in one seamless demo.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMode("master");
                      setShowDemo(true);
                    }}
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20c15c] text-[#044137] font-bold px-6 py-3 rounded-lg transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Launch Master Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Meta API Compliance Banner */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-[#1877F2]/10 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#1877F2]" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 text-lg">Meta Verified Technology Partner</h3>
              <p className="text-gray-600 text-sm mt-2">
                All conversations follow Meta's WhatsApp Business API guidelines — opt-in compliance, 24-hour messaging window, approved templates, and end-to-end encryption.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2 text-xs">
              {["WABA Compliant", "Opt-in Based", "Template Approved", "E2E Encrypted"].map((t) => (
                <span key={t} className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#044137] via-[#075E54] to-[#128C7E] text-center py-8 flex-shrink-0">
        <p className="text-green-200 text-sm">
          powered by{" "}
          <a href="https://rather.chat" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:text-green-300 transition-colors">
            rather.chat
          </a>
          {" "}AI-Powered WhatsApp Sales Solutions <a href="mailto:human@rather.chat" className="text-green-300 hover:text-white transition-colors">human@rather.chat</a>
        </p>
      </footer>
    </div>
  );
}
