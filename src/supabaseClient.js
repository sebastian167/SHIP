import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wiczxiowwrpduulmsgbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpY3p4aW93d3JwZHV1bG1zZ2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzIwOTEsImV4cCI6MjA4NzgwODA5MX0.FPkvpnjeHnSbrzE3oooEQ0Fiosrbk5ofKboI7q4Lers';

export const supabase = createClient(supabaseUrl, supabaseKey);
