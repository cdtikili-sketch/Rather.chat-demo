import React, { useState } from 'react';
import { DemoMode, DemoContext } from './types';
import CompanyInput from './components/CompanyInput';
import DemoEngine from './components/DemoEngine';
import {
  MessageCircle, Users, TrendingUp, Zap, ArrowRight, Shield,
  Star, BarChart3, Globe, CheckCircle2, PhoneCall, Target, ShoppingCart, X, Play, ChevronLeft
} from 'lucide-react';

const DEMO_MODES: { id: DemoMode; label: string; icon: React.ReactNode; color: string; tagline: string; description: string }[] = [
  {
    id: 'contact',
    label: 'CONTACT',
    icon: <PhoneCall className="w-5 h-5" />,
    color: 'from-blue-600 to-blue-500',
    tagline: 'Capture & Qualify Leads',
    description: 'Capture lead details via WhatsApp from Meta Ads or website traffic. Pre-qualify in real time.',
  },
  {
    id: 'connect',
    label: 'CONNECT',
    icon: <Users className="w-5 h-5" />,
    color: 'from-teal-600 to-teal-500',
    tagline: 'Engage & Advise',
    description: 'Keep customers engaged with meaningful conversations, quotes and expert knowledge.',
  },
  {
    id: 'convert',
    label: 'CONVERT',
    icon: <ShoppingCart className="w-5 h-5" />,
    color: 'from-green-600 to-green-500',
    tagline: 'Close Sales on WhatsApp',
    description: 'Complete purchases, policies and subscriptions directly in WhatsApp — 60% higher conversion.',
  },
  {
    id: 'master',
    label: 'MASTER DEMO',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-[#075E54] to-[#128C7E]',
    tagline: 'All Three Solutions in One',
    description: 'The complete Contact → Connect → Convert workflow demonstrating the full rather.chat platform.',
  },
];

const STATS = [
  { value: '17M+', label: 'South Africans Reached', icon: <Globe className="w-5 h-5" /> },
  { value: '300M+', label: 'Messages Processed', icon: <MessageCircle className="w-5 h-5" /> },
  { value: '85%', label: 'AI-Completed Sales', icon: <Target className="w-5 h-5" /> },
  { value: '60%', label: 'Conversion Uplift', icon: <TrendingUp className="w-5 h-5" /> },
];

const FEATURES = [
  { icon: <Shield className="w-4 h-4" />, label: 'Meta Verified Technology Partner' },
  { icon: <CheckCircle2 className="w-4 h-4" />, label: 'WhatsApp Business API Compliant' },
  { icon: <Star className="w-4 h-4" />, label: 'Trusted by Capitec, Hollard & more' },
  { icon: <BarChart3 className="w-4 h-4" />, label: 'End-to-end Encrypted Conversations' },
];

interface DemoState {
  companyName: string;
  companyUrl: string;
  industry: string;
  active: boolean;
}

const salesJourney = [
  { step: 1, label: 'Trigger', desc: 'Meta ad / Website CTA', status: 'complete' },
  { step: 2, label: 'Starter phrase', desc: 'User opts in via WhatsApp', status: 'complete' },
  { step: 3, label: 'Pre-qualification', desc: 'Capture name / intent', status: 'active' },
  { step: 4, label: 'Conversion', desc: 'Handoff / quote / sale', status: 'pending' },
];

export default function App() {
  const [selectedMode, setSelectedMode] = useState<DemoMode>('master');
  const [demoState, setDemoState] = useState<DemoState>({
    companyName: 'rather.chat',
    companyUrl: 'rather.chat',
    industry: 'general',
    active: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoKey, setDemoKey] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [demoStarted, setDemoStarted] = useState(false);

  const handleGenerateDemo = (name: string, url: string, industry: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setDemoState({ companyName: name, companyUrl: url, industry, active: true });
      setDemoKey(k => k + 1);
      setShowDemo(true);
      setAutoMode(false);
      setDemoStarted(false);
      setIsGenerating(false);
    }, 1200);
  };

  const handleModeChange = (mode: DemoMode) => {
    setSelectedMode(mode);
    setDemoKey(k => k + 1);
  };

  const context: DemoContext = {
    companyName: demoState.companyName,
    companyUrl: demoState.companyUrl,
    industry: demoState.industry,
  };

  // Full-screen demo view
  if (showDemo) {
    return (
      <div className="fixed inset-0 bg-[#0f1419] z-50 flex flex-col">
        {/* Top bar */}
        <div className="bg-[#1a1f28] border-b border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowDemo(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="min-w-0">
              <p className="text-green-400 font-bold text-sm truncate">rather.chat</p>
              <p className="text-gray-400 text-xs truncate">{demoState.companyName} · {selectedMode.toUpperCase()}</p>
            </div>
          </div>

          {/* Mode buttons */}
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {DEMO_MODES.map((dm) => (
              <button
                key={dm.id}
                onClick={() => handleModeChange(dm.id)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all flex-shrink-0 ${
                  selectedMode === dm.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {dm.icon}
                <span className="hidden sm:inline">{dm.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDemo(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden flex-col lg:flex-row bg-white">
          {/* Left sidebar */}
          <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 overflow-y-auto flex-col p-4 space-y-4">
            {/* Active company */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-bold">Current Demo</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {demoState.companyName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{demoState.companyName}</p>
                  <p className="text-xs text-gray-500 truncate">{demoState.companyUrl}</p>
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {['Contact', 'Connect', 'Convert'].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulation controls */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Simulation</p>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setAutoMode(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    autoMode ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Play className="w-3 h-3" /> AUTO
                </button>
                <button
                  onClick={() => setAutoMode(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    !autoMode ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  MANUAL
                </button>
              </div>
              {autoMode && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-gray-600">Speed</label>
                    <span className="text-xs font-bold text-green-600">{speed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.5"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-green-600 rounded-full"
                  />
                </div>
              )}

              {/* Play Demo Button */}
              <button
                onClick={() => setDemoStarted(true)}
                disabled={demoStarted}
                className={`w-full mt-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  !demoStarted
                    ? 'bg-[#128C7E] text-white hover:bg-[#0f6a5f] cursor-pointer'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4" />
                Play Demo
              </button>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Live Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-2xl font-black text-green-600">4</p>
                  <p className="text-xs text-gray-600 mt-1">Bot Msgs</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-2xl font-black text-blue-600">4</p>
                  <p className="text-xs text-gray-600 mt-1">User Msgs</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-2xl font-black text-purple-600">63%</p>
                  <p className="text-xs text-gray-600 mt-1">Progress</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                  <p className="text-2xl font-black text-yellow-600">2</p>
                  <p className="text-xs text-gray-600 mt-1">Data Points</p>
                </div>
              </div>
            </div>

            {/* Sales journey */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Sales Journey</p>
              <div className="space-y-3">
                {salesJourney.map((j, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
                        j.status === 'complete'
                          ? 'bg-green-500 text-white'
                          : j.status === 'active'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {j.status === 'complete' ? '✓' : j.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900">{j.label}</p>
                      <p className="text-xs text-gray-600">{j.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: demo content */}
          <div className="flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1419] via-[#1a1f28] to-[#151a22] relative p-4 lg:p-0">
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/Rocket.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1419]/75 via-[#1a1f28]/70 to-[#0f1419]/75" />

            {/* Phone mockup */}
            <div className="relative z-10">
              <div className="rounded-3xl bg-gray-900 shadow-2xl overflow-hidden w-full max-w-sm lg:max-w-md" style={{ aspectRatio: '9/16', minHeight: '600px' }}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-30 border-2 border-gray-800" />
                {/* Screen */}
                <div className="absolute inset-0 top-7 bg-white overflow-hidden rounded-b-3xl">
                  <DemoEngine
                    key={`${selectedMode}-${demoKey}`}
                    mode={selectedMode}
                    context={context}
                    autoMode={demoStarted && autoMode}
                    onAutoModeChange={(enabled) => {
                      setDemoStarted(true);
                      setAutoMode(enabled);
                    }}
                    speed={speed}
                  />
                </div>
                {/* Bottom pill */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full z-30" />
                {/* Side bezels */}
                <div className="absolute inset-y-0 left-0 w-1.5 bg-gray-900 z-40" />
                <div className="absolute inset-y-0 right-0 w-1.5 bg-gray-900 z-40" />
              </div>
            </div>

            {/* Center text overlay */}
            <div className="absolute top-8 left-4 right-4 text-center z-10 pointer-events-none lg:top-12 lg:left-12 lg:right-12">
              {(() => {
                const dm = DEMO_MODES.find(d => d.id === selectedMode);
                return dm ? (
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">{dm.label}</h2>
                    <p className="text-base lg:text-lg text-green-300">{dm.tagline}</p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="hidden lg:flex lg:w-72 bg-white border-l border-gray-200 overflow-y-auto flex-col p-4 space-y-4">
            {/* Compliance checklist */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Meta API Compliance</p>
              <div className="space-y-2.5 text-xs">
                {[
                  'Opt-in via WhatsApp button',
                  '24-hour messaging window',
                  'Approved templates only',
                  'COPPA consent before handoff',
                  'STOP keyword honoured',
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-[#128C7E] transition-colors">
                    <input type="checkbox" defaultChecked className="accent-green-600 rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Solution details */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm font-bold text-gray-900 mb-3">
                {selectedMode === 'contact'
                  ? 'Contact Solution'
                  : selectedMode === 'connect'
                  ? 'Connect Solution'
                  : selectedMode === 'convert'
                  ? 'Convert Solution'
                  : 'Master Workflow'}
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[#128C7E] font-bold flex-shrink-0 pt-0.5">Use case</span>
                  <span className="text-gray-700">
                    {selectedMode === 'contact'
                      ? 'Capture & qualify leads'
                      : selectedMode === 'connect'
                      ? 'Engage with expert advice'
                      : selectedMode === 'convert'
                      ? 'Direct purchase on WhatsApp'
                      : 'All three solutions combined'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#128C7E] font-bold flex-shrink-0 pt-0.5">Trigger</span>
                  <span className="text-gray-700">Customer clicked Meta Ad</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#128C7E] font-bold flex-shrink-0 pt-0.5">Avg time</span>
                  <span className="text-gray-700">~2-4 min</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#128C7E] font-bold flex-shrink-0 pt-0.5">Conversion</span>
                  <span className="text-[#128C7E] font-bold">+38%</span>
                </div>
              </div>
            </div>

            {/* Quick docs */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Documentation</p>
              <div className="space-y-1.5 text-xs">
                {['Cloud API reference', 'Interactive messages', 'Catalog & commerce', 'Product catalog API'].map(
                  (doc, i) => (
                    <p key={i} className="flex items-center gap-2 text-gray-700 hover:text-[#128C7E] cursor-pointer transition-colors">
                      <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                      {doc}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Landing page with rocket background
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Hero Header with Rocket Background */}
      <header
        className="relative overflow-hidden py-12 sm:py-16 lg:py-20 flex-shrink-0"
        style={{
          backgroundImage: 'url(/Rocket.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#044137]/85 via-[#075E54]/80 to-[#128C7E]/85" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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
                If you're not conversing,<br />
                <span className="text-[#25D366]">you're not converting.</span>
              </h1>
              <p className="mt-6 text-green-100 text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered WhatsApp sales solutions. Contact, Connect, and Convert your customers in real time — at scale.
              </p>

              <div className="flex flex-wrap gap-2 mt-8 justify-center lg:justify-start">
                {FEATURES.map((f, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm text-green-100 bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-2 rounded-full hover:bg-white/20 transition-colors">
                    <span className="text-[#25D366]">{f.icon}</span>
                    <span className="hidden sm:inline">{f.label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0 w-full lg:w-auto">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-5 text-center hover:bg-white/20 transition-all shadow-lg">
                  <div className="flex justify-center text-[#25D366] mb-2">{stat.icon}</div>
                  <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-green-200 text-xs mt-2 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#128C7E]/10 text-[#128C7E] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-[#128C7E]/20">
              <Zap className="w-3 h-3" />
              Interactive Live Demos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
              Three Solutions. One Platform. Proven Results.
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base leading-relaxed">
              Personalise the demo with your client's details, then explore each solution or run the complete Master Demo workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Config Panel */}
            <div className="space-y-6">
              <CompanyInput onSubmit={handleGenerateDemo} isLoading={isGenerating} />

              {/* About section */}
              <div className="bg-gradient-to-br from-[#044137] to-[#075E54] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-4">Why WhatsApp?</h3>
                <ul className="space-y-2.5 text-sm text-green-100">
                  <li className="flex items-center gap-2"><span className="text-[#25D366] font-bold text-lg leading-none">✓</span> 28–29M South Africans use WhatsApp</li>
                  <li className="flex items-center gap-2"><span className="text-[#25D366] font-bold text-lg leading-none">✓</span> 72% prefer it over phone, SMS, email</li>
                  <li className="flex items-center gap-2"><span className="text-[#25D366] font-bold text-lg leading-none">✓</span> 70–90%+ open/read rates</li>
                  <li className="flex items-center gap-2"><span className="text-[#25D366] font-bold text-lg leading-none">✓</span> 4–5x higher engagement than email</li>
                  <li className="flex items-center gap-2"><span className="text-[#25D366] font-bold text-lg leading-none">✓</span> 60% uplift in conversion rates</li>
                </ul>
                <a href="mailto:human@rather.chat" className="mt-5 inline-flex items-center gap-2 text-[#25D366] text-sm font-semibold hover:text-green-300 transition-colors">
                  Get started <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Center & Right: Demo cards + How it works */}
            <div className="lg:col-span-2">
              {/* Solution Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {[
                  { id: 'contact', label: 'Contact', desc: 'Lead capture & qualification', icon: <PhoneCall className="w-6 h-6" />, color: 'text-blue-600 bg-blue-50', gradient: 'from-blue-600 to-blue-500' },
                  { id: 'connect', label: 'Connect', desc: 'Engagement & expert advice', icon: <Users className="w-6 h-6" />, color: 'text-teal-600 bg-teal-50', gradient: 'from-teal-600 to-teal-500' },
                  { id: 'convert', label: 'Convert', desc: 'Direct purchase in WhatsApp', icon: <ShoppingCart className="w-6 h-6" />, color: 'text-green-600 bg-green-50', gradient: 'from-green-600 to-green-500' },
                ].map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:border-gray-200 group">
                    <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <p className="font-bold text-gray-900 text-lg">{item.label}</p>
                    <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
                    <button
                      onClick={() => { setSelectedMode(item.id as DemoMode); setShowDemo(true); }}
                      className={`mt-5 w-full text-sm font-semibold px-4 py-3 rounded-lg bg-gradient-to-r ${item.gradient} text-white hover:shadow-lg transition-all hover:scale-105`}
                    >
                      Try Demo
                    </button>
                  </div>
                ))}
              </div>

              {/* Master Demo Card */}
              <div
                className="rounded-xl p-8 text-white mb-8 overflow-hidden relative shadow-xl"
                style={{
                  backgroundImage: 'url(/Rocket.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#044137]/92 via-[#075E54]/88 to-[#128C7E]/92" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Zap className="w-7 h-7 text-[#25D366]" />
                    </div>
                    <h3 className="font-bold text-2xl">Master Demo</h3>
                  </div>
                  <p className="text-green-100 text-base mb-6 leading-relaxed max-w-2xl">
                    Experience the complete Contact → Connect → Convert workflow in one seamless demo. See all three solutions working together across a real sales journey.
                  </p>
                  <button
                    onClick={() => { setSelectedMode('master'); setShowDemo(true); }}
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20c15c] text-[#044137] font-bold px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:scale-105"
                  >
                    Launch Master Demo <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-r from-[#075E54]/8 to-[#128C7E]/8 border border-[#128C7E]/20 rounded-xl p-8">
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
                All conversations follow Meta's WhatsApp Business API guidelines — opt-in compliance, 24-hour messaging window policy, approved message templates, and end-to-end encryption.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2 text-xs">
              {['WABA Compliant', 'Opt-in Based', 'Template Approved', 'E2E Encrypted'].map(t => (
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
          powered by{' '}
          <a href="https://rather.chat" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-bold hover:text-green-300 transition-colors">
            rather.chat
          </a>
          {' '}· AI-Powered WhatsApp Sales Solutions · <a href="mailto:human@rather.chat" className="text-green-300 hover:text-white transition-colors">human@rather.chat</a>
        </p>
      </footer>
    </div>
  );
}
