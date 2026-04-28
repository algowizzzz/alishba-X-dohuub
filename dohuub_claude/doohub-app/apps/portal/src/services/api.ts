import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { supabase } from '../lib/supabase';

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://dohuubclaude-production.up.railway.app'
    : 'http://localhost:3001');

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use(async (config) => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (r) => r,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // token invalid — let caller decide whether to redirect
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: object) {
    return this.client.get<T>(url, { params }).then((r) => r.data);
  }
  post<T>(url: string, data?: object) {
    return this.client.post<T>(url, data).then((r) => r.data);
  }
  put<T>(url: string, data?: object) {
    return this.client.put<T>(url, data).then((r) => r.data);
  }
  patch<T>(url: string, data?: object) {
    return this.client.patch<T>(url, data).then((r) => r.data);
  }
  delete<T>(url: string) {
    return this.client.delete<T>(url).then((r) => r.data);
  }
}

export const api = new ApiService();
export default api;
