import { createClient } from '@supabase/supabase-js';

// On force le typage en string pour éviter les erreurs TypeScript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Validation basique de l'URL
const isValidUrl = (url: string) => {
  try {
    return url && new URL(url).protocol.startsWith('http');
  } catch {
    return false;
  }
};

const isConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey;

// DEBUG : On vérifie dans la console si les clés sont là
console.log("Supabase Config Check:", {
  urlValid: isValidUrl(supabaseUrl),
  keyPresent: !!supabaseAnonKey,
  status: isConfigured ? 'OK' : 'MISSING/INVALID'
});

if (!isConfigured) {
  console.error("🚨 ERREUR CRITIQUE : Les clés Supabase sont invalides ou manquantes !");
}

// Pour éviter le crash (White Page), on utilise des valeurs bidons si la config est mauvaise.
// Cela permettra à l'interface de s'afficher (avec des erreurs de requête, mais pas de crash global).
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder');

export const isSupabaseConfigured = isConfigured;