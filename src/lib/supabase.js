import { createClient } from "@supabase/supabase-js"

const supabaseUrl = env.REACT_APP_SUPABASE_URL
const supabaseKey = env.REACT_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Variáveis de ambiente REACT_APP_SUPABASE_URL e VITE_SUPABASE_KEY são obrigatórias")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
