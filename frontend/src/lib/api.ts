const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    next: { revalidate: 0 }, // disable caching for SSR data fetching
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  get: <T = any>(path: string, token?: string): Promise<T> =>
    request<T>(path, { method: 'GET' }, token),

  post: <T = any>(path: string, body: any, token?: string): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),

  put: <T = any>(path: string, body: any, token?: string): Promise<T> =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token),

  delete: <T = any>(path: string, token?: string): Promise<T> =>
    request<T>(path, { method: 'DELETE' }, token),
};
