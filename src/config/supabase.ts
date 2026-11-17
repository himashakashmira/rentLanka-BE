import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
const supabaseKey = (
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim();

export const SUPABASE_BUCKET = (process.env.SUPABASE_BUCKET || "rentlanka-images").trim();

// make supabase client
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
