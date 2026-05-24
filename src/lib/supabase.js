import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL
const supabaseKey = import.meta.env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
