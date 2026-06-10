import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://piftjrqmkarfywpaheeu.supabase.co";
const supabaseKey = "sb_publishable_aKGqO6O0UkX3gn5XhH9W3A_RQ6YMJr1";

export const supabase = createClient(supabaseUrl, supabaseKey);
``
