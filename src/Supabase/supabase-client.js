import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
    "https://naymcfpairqlvhwneaxf.supabase.co",
    "sb_publishable_ycAKTpldhmlXe1Z9GFG_CQ_NaJo7nfV",
    {
    auth: {
    persistSession: true,     
    autoRefreshToken: true,  
    detectSessionInUrl: true,
    },
    },
)