import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiotpmjbhjpegylqgrwd.supabase.co';
const supabaseAnonKey = 'sb_publishable_cyDVvfP9gm6PYGKtQ21EpQ_1DjEJDeA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
