import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// load env file first
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
// can be anon key or publishable key
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

// make supabase client
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;