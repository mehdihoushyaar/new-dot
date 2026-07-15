import axios, { type AxiosInstance } from "axios";
import { env } from "@/config/env";
import { attachRefreshInterceptor } from "./interceptors";

function createClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
  });
  attachRefreshInterceptor(client);
  return client;
}

export const apiClient = createClient(env.API_BASE_URL);
export const apiClientV2 = createClient(env.API_V2_URL);
export const apiClientV3 = createClient(env.API_V3_URL);
export const apiClientChat = createClient(env.API_CHAT_URL);
