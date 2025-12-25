export const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  }
  const text = await res.text();
  if (!res.ok) throw { status: res.status, data: text };
  return text;
}

export async function apiUpload(path: string, formData: FormData, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    ...options,
    headers,
    body: formData,
  });
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) throw { status: res.status, data };
    return data;
  }
  const text = await res.text();
  if (!res.ok) throw { status: res.status, data: text };
  return text;
}
