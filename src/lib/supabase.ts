
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Initialize the Supabase client
const supabaseUrl = 'https://axdywblewdfoeqirsfww.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4ZHl3Ymxld2Rmb2VxaXJzZnd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjQwOTQsImV4cCI6MjA2MDE0MDA5NH0.XbAgYDw2mjkHcjSjYmdMOqHTTUpqssBGPGaYWpUMeUM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
