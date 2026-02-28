import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wiczxiowwrpduulmsgbg.supabase.co';
const supabaseKey = 'sb_publishable_WOqnx5S7MHraBgEOCoNBLg_qJ9GWu_k';

export const supabase = createClient(supabaseUrl, supabaseKey);
