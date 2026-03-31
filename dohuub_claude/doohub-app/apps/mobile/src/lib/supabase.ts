import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiotpmjbhjpegylqgrwd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpb3RwbWpiaGpwZWd5bHFncndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDQ3MTAsImV4cCI6MjA4NDAyMDcxMH0.NnH4WAZOflA0twj9qoD0Nqa7LVvBqIi6PRvuS3zuZ9c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
