import { createClient } from '@supabase/supabase-js';

// On force le typage en string pour éviter les erreurs TypeScript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// DEBUG : On vérifie dans la console si les clés sont là (sans les afficher en entier pour la sécurité)
console.log("Supabase Config Check:", {
  urlExpected: !!supabaseUrl,
  keyExpected: !!supabaseAnonKey,
  urlStart: supabaseUrl ? supabaseUrl.substring(0, 8) + '...' : 'MISSING',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 ERREUR CRITIQUE : Les clés Supabase sont manquantes dans le build !");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);