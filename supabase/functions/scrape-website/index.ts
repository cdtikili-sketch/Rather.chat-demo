import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BrandInfo {
  url: string;
  domain: string;
  brand: string;
  title: string;
  description: string;
  industry: string;
  offerings: string[];
  accent?: string;
  logo?: string;
}

function detectIndustry(text: string, url: string): string {
  const combined = (text + " " + url).toLowerCase();

  const buckets: Array<[string, string[]]> = [
    ["insurance", ["insurance", "policy", "cover", "premium", "claim", "insur", "hollard", "discovery", "sanlam"]],
    ["finance", ["loan", "bank", "credit", "finance", "mortgage", "ooba", "capitec", "fund", "investec"]],
    ["retail", ["retail", "shop", "store", "fashion", "cloth", "edgars", "clicks", "wear", "apparel", "boots"]],
    ["solar", ["solar", "energy", "power", "battery", "inverter", "loadshed", "eskom", "sun", "panel"]],
    ["telecoms", ["mobile", "data", "airtime", "network", "fibre", "fiber", "telecom"]],
    ["education", ["course", "learn", "student", "training", "school", "education", "university"]],
    ["health", ["clinic", "health", "doctor", "pharmacy", "medic", "hospital"]],
    ["food", ["restaurant", "menu", "drink", "food", "beverage", "cafe", "dining"]],
    ["travel", ["travel", "book", "flight", "hotel", "tour", "vacation", "resort"]],
    ["automotive", ["car", "vehicle", "dealership", "automotive", "motor"]],
    ["real estate", ["property", "rent", "real estate", "apartment", "property developer"]],
  ];

  for (const [industry, keywords] of buckets) {
    if (keywords.some((k) => combined.includes(k))) return industry;
  }

  return "general";
}

function extractOfferings(html: string): string[] {
  const headings = Array.from(html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi))
    .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
    .filter((t) => t.length > 3 && t.length < 60 && !/cookie|menu|navigation|skip to|toggle|search|sign in|log in/i.test(t));
  const uniq = Array.from(new Set(headings)).slice(0, 4);
  return uniq.length ? uniq : ["Our products", "Our services", "Support"];
}

function extractBrand(html: string): string {
  const og = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();

  const raw = og || title?.split(/[-–|·:]/)[0] || h1 || "Company";
  return raw.replace(/\s+/g, " ").slice(0, 40).trim();
}

function extractAccent(html: string): string | undefined {
  const theme = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i)?.[1];
  if (theme && /^#?[0-9a-f]{3,8}$/i.test(theme.replace("#", ""))) {
    return theme.startsWith("#") ? theme : `#${theme}`;
  }

  const m = html.match(/(?:primary|brand|accent)[^#]{0,40}#([0-9a-f]{6})\b/i);
  if (m) return `#${m[1]}`;

  return undefined;
}

function extractLogo(html: string, baseUrl: string): string | undefined {
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const icon = html.match(/<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i)?.[1];

  const found = og || icon;
  if (!found) return undefined;

  try {
    return new URL(found, baseUrl).toString();
  } catch {
    return undefined;
  }
}

async function scrapeBrand(url: string): Promise<BrandInfo> {
  try {
    let fullUrl = url.trim();
    if (!/^https?:\/\//i.test(fullUrl)) fullUrl = "https://" + fullUrl;

    let domain = fullUrl;
    try {
      domain = new URL(fullUrl).hostname.replace(/^www\./, "");
    } catch {
      // noop
    }

    const brandFromDomain = domain.split(".")[0].replace(/[-_]/g, " ");
    const fallback: BrandInfo = {
      url: fullUrl,
      domain,
      brand: brandFromDomain.replace(/\b\w/g, (c) => c.toUpperCase()),
      title: brandFromDomain,
      description: "",
      industry: "general",
      offerings: ["Our products", "Our services", "Support"],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(fullUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RatherChatBot/1.0; +https://rather.chat)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) return fallback;

    const html = (await response.text()).slice(0, 300_000);

    const title = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
      fallback.title;

    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
      "";

    const offerings = extractOfferings(html);
    const industry = detectIndustry(title + " " + description + " " + offerings.join(" "), fullUrl);
    const brand = extractBrand(html) || fallback.brand;
    const accent = extractAccent(html);
    const logo = extractLogo(html, fullUrl);

    return { url: fullUrl, domain, brand, title, description, industry, offerings, accent, logo };
  } catch (error) {
    const fallback: BrandInfo = {
      url: "",
      domain: "",
      brand: "Company",
      title: "Company",
      description: "",
      industry: "general",
      offerings: ["Our products", "Our services", "Support"],
    };
    return fallback;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const brandInfo = await scrapeBrand(url);

    return new Response(JSON.stringify(brandInfo), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
