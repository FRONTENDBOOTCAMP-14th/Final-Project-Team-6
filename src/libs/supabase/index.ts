import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_API_KEY } = process.env;

if (!NEXT_PUBLIC_SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_API_KEY) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}

const supabase = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_API_KEY
);

export default supabase;
