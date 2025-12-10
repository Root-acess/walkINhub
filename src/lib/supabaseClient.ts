import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://baaaovsymwalehmdytlg.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;  // <— FIXED

export const supabase = createClient(supabaseUrl, supabaseKey);
