const TOKEN_KEY = 'garantfacile_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === 'number' && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function login(email: string, password: string): Promise<{ user: any; accessToken: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }

  const data = await res.json();
  setAuthToken(data.accessToken);
  return data;
}

export async function register(dto: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  consentRgpd: boolean;
  consentMarketing?: boolean;
}): Promise<{ user: any; accessToken: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }

  const data = await res.json();
  setAuthToken(data.accessToken);
  return data;
}

export function logout(): void {
  removeAuthToken();
  window.location.href = '/';
}
