import { createClient } from "@supabase/supabase-js";

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl =
  typeof envSupabaseUrl === "string" && envSupabaseUrl.startsWith("http")
    ? envSupabaseUrl
    : "https://gacgollaafyecysczbs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY env var");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
