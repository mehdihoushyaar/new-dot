export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  API_V2_URL: process.env.NEXT_PUBLIC_API_V2_URL ?? "http://localhost:8000/api/v2",
  API_V3_URL: process.env.NEXT_PUBLIC_API_V3_URL ?? "http://localhost:8000/api/v3",
  API_CHAT_URL: process.env.NEXT_PUBLIC_API_CHAT_URL ?? "http://localhost:8001/api",
  WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "http://localhost:8001",
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  
} as const;
