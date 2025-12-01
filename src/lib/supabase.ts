import { createClient } from '@supabase/supabase-js';

// These should be set in your environment variables
// For now, we'll use the same values from the backend .env
// In production, you'd want to use Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Use placeholder values if not set to prevent errors
// The app will still work but auth features won't function
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL and Anon Key are not set. Authentication features will not work.\n' +
    'Please create a .env file in the root directory with:\n' +
    'VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=your-anon-key-here\n\n' +
    'Note: These are the same values used in backend/.env but with VITE_ prefix for Vite to expose them.'
  );
}

export const supabase = createClient(url, key);
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

