import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

