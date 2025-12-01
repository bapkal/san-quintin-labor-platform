import { supabase } from './supabase';

/**
 * Make an authenticated API request to the backend
 * Automatically includes the Supabase auth token in headers
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

