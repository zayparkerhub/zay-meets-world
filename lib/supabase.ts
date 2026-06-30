import { createClient } from '@supabase/supabase-js'

function getUrl()  { return process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '' }
function getAnon() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' }

export function browserClient() {
  return createClient(getUrl(), getAnon())
}

export function serverClient() {
  return createClient(getUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY ?? getAnon())
}
