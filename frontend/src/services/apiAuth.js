const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function setTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function apiJson(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.detail || data?.message || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiForm(path, { method = "POST", formData, body, auth = true } = {}) {
  const headers = {};
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData ?? body, // ✅ supports both
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.detail || data?.message || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
