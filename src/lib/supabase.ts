import { createClient } from "@supabase/supabase-js";

// Đường dẫn Project URL của bạn (đã bỏ phần đuôi /rest/v1)
const supabaseUrl = "https://sgbkodqnmghpwzyiaamt.supabase.co";

// Publishable API Key của bạn
const supabaseAnonKey = "sb_publishable_2O-GKGLaoKRQzH5IO25yFA_6QQC8cDx";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
