import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createDemoSession(type: string, companyName: string, companyUrl: string, industry: string) {
  const { data, error } = await supabase
    .from('demo_sessions')
    .insert({ session_type: type, company_name: companyName, company_url: companyUrl, industry })
    .select()
    .maybeSingle();
  if (error) console.error(error);
  return data;
}

export async function saveDemoLead(sessionId: string, lead: { name: string; phone: string; email: string; interest: string }) {
  const { error } = await supabase
    .from('demo_leads')
    .insert({ session_id: sessionId, ...lead });
  if (error) console.error(error);
}
