import axios from "axios";
const BASE = import.meta.env.VITE_API_BASE || "";
const PREFIX = (import.meta.env.VITE_API_PREFIX ?? "").trim();
const api = axios.create({ baseURL: BASE, withCredentials: false });

api.interceptors.request.use((config) => {
  const authRaw = localStorage.getItem("ie:auth");
  if (authRaw) {
    try {
      const { token } = JSON.parse(authRaw);
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

export function path(p) {
  const prefix = PREFIX.endsWith("/") ? PREFIX.slice(0, -1) : PREFIX;
  const tail = p.startsWith("/") ? p : `/${p}`;
  return `${prefix}${tail}` || tail;
}

export default api;
