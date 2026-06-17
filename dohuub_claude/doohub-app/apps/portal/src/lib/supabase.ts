import { createClient } from '@supabase/supabase-js';

// Read from Vite env. Fallback to the project's anon credentials so a missing
// dashboard config doesn't silently brick the build (anon key is public).
const DEFAULT_SUPABASE_URL = 'https://qiotpmjbhjpegylqgrwd.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpb3RwbWpiaGpwZWd5bHFncndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDQ3MTAsImV4cCI6MjA4NDAyMDcxMH0.NnH4WAZOflA0twj9qoD0Nqa7LVvBqIi6PRvuS3zuZ9c';

const supabaseUrl =
  (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
