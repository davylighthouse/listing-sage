// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mdyinghwnolqquenakzc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keWluZ2h3bm9scXF1ZW5ha3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMjMyMzYsImV4cCI6MjA1NDc5OTIzNn0.PuwgvnKcOckUQM35oLfxlno3GJYAVoypk6ZhCQDilz8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);