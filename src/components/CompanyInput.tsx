import { useState } from "react";
import { Building2, Globe, Loader2, Sparkles, Zap } from "lucide-react";
import { detectIndustry, normalizeIndustry } from "@/lib/utils";

export interface CompanySubmit {
  companyName: string;
  companyUrl: string;
  industry: string;
  accent?: string;
  logo?: string;
}

const INDUSTRIES = [
  { value: "auto", label: "Auto", icon: "\u{1F50D}" },
  { value: "insurance", label: "Insurance", icon: "\u{1F6E1}\u{FE0F}" },
  { value: "retail", label: "Retail", icon: "\u{1F6CD}\u{FE0F}" },
  { value: "finance", label: "Finance", icon: "\u{1F4B0}" },
  { value: "solar", label: "Solar", icon: "\u26A1" },
  { value: "general", label: "Other", icon: "\u{1F3E2}" },
];

const PRESETS = [
  { name: "Hollard Insurance", url: "hollard.co.za", industry: "insurance" },
  { name: "Edgars Fashion", url: "edgars.co.za", industry: "retail" },
  { name: "Capitec Bank", url: "capitecbank.co.za", industry: "finance" },
  { name: "GoSolr", url: "gosolr.co.za", industry: "solar" },
];

export function CompanyInput({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: CompanySubmit) => void;
  isLoading?: boolean;
}) {
  const [name, setName] = useState(" ");
  const [url, setUrl] = useState(" ");
  const [industry, setIndustry] = useState("Auto");
  const [scraping, setScraping] = useState(true);
  const [status, setStatus] = useState<{ kind: "ok" | "warn" | "err"; text: string } | null>(null);
  const [scrapedExtras, setScrapedExtras] = useState<{ accent?: string; logo?: string }>({});

  const handleScrape = async () => {
    if (!url.trim()) return;
    setScraping(true);
    setStatus(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/scrape-website`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.title && data.title !== "Unknown") {
        setName(data.title);
      }
      if (data.industry) {
        const norm = normalizeIndustry(data.industry);
        if (norm !== "general") setIndustry(norm);
      }
      setScrapedExtras({ accent: data.accent, logo: data.logo });
      setStatus({ kind: "ok", text: `Detected ${data.title || name} \u00B7 ${data.industry || industry}` });
    } catch {
      setStatus({ kind: "warn", text: "Couldn't fetch site \u2014 using your manual values" });
    } finally {
      setScraping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const finalIndustry = industry === "auto" ? detectIndustry(url, name) : industry;
    onSubmit({
      companyName: name.trim(),
      companyUrl: url.trim() || "\u2014",
      industry: finalIndustry,
      accent: scrapedExtras.accent,
      logo: scrapedExtras.logo,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Company Name *
        </label>
        <div className="relative">
          <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Solaax Energy"
            required
            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Website URL
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. www.company.com"
              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleScrape}
            disabled={!url.trim() || scraping || isLoading}
            title="Analyse website"
            className="px-3 py-2 bg-[#128C7E] hover:bg-[#0f6a5f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            {scraping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          </button>
        </div>
        {status && (
          <div
            className={`mt-2 text-[0.7rem] font-mono px-2 py-1 rounded ${
              status.kind === "ok"
                ? "text-[#128C7E] bg-[#128C7E]/8"
                : status.kind === "err"
                  ? "text-red-600 bg-red-50"
                  : "text-orange-600 bg-orange-50"
            }`}
          >
            {status.text}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Industry
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {INDUSTRIES.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setIndustry(opt.value)}
              className={`px-2 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                industry === opt.value
                  ? "bg-[#128C7E] text-white border border-[#128C7E]"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{opt.icon}</span>
              <span className="hidden sm:inline">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          Quick Presets
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p.name}
              onClick={() => {
                setName(p.name);
                setUrl(p.url);
                setIndustry(p.industry);
                setScrapedExtras({});
                setStatus(null);
              }}
              className="text-xs px-3 py-2 bg-gray-50 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors text-left truncate"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim() || isLoading}
        className="w-full bg-gradient-to-r from-[#128C7E] to-[#0f6a5f] hover:from-[#0f6a5f] hover:to-[#085a50] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide shadow-md"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Live Demo
          </>
        )}
      </button>
    </form>
  );
}
