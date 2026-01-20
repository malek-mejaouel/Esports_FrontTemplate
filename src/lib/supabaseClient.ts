"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is not set. Please check your environment variables.");
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "Set" : "Not Set");
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Not Set");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);