import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";

type QueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let queue: QueueItem[] = [];
let authInvalidateCb: (() => void) | null = null;

export function registerAuthInvalidate(cb: () => void) {
  authInvalidateCb = cb;
}

function processQueue(error: unknown, token: unknown = null) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
}

async function refreshToken(): Promise<void> {
  await axios.post(
    `${env.API_BASE_URL}/auth/token/refresh/`,
    {},
    { withCredentials: true }
  );
}

export function attachRefreshInterceptor(client: AxiosInstance) {
  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: () => resolve(client(original)),
            reject,
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await refreshToken();
        processQueue(null);
        return client(original);
      } catch (refreshError) {
        processQueue(refreshError);
        authInvalidateCb?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

export function clearAuthAndRedirect() {
  authInvalidateCb?.();
}
