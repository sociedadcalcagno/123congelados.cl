import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  typeof window !== "undefined" && window.location.hostname.includes("123congelados.cl")
    ? `${window.location.origin}/supabase`
    : import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
