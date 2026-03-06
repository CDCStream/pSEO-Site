import { createClient } from '@supabase/supabase-js';

let _client = null;

function getClient() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !url.startsWith('http')) return null;
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    const client = getClient();
    if (!client) {
      if (prop === 'from') return () => ({
        select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }), single: () => ({ data: null, error: { message: 'Supabase not configured' } }), data: [], error: null }), data: [], error: null }),
        upsert: () => ({ select: () => ({ single: () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      });
      return undefined;
    }
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});
