"use client";

import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
// You will need to set these as environment variables in your project.
// For local development, you can add them to a .env.local file:
// VITE_SUPABASE_URL=YOUR_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is not set. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);