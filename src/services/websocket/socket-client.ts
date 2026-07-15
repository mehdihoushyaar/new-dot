import { io, type Socket } from "socket.io-client";
import { env } from "@/config/env";

const SOCKET_ID_KEY = "socket_id";

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;
    this.socket = io(env.WEBSOCKET_URL, {
      path: "/chat/socket",
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30_000,
      randomizationFactor: 0.5,
    });
    this.socket.on("connect", () => {
      if (this.socket?.id) localStorage.setItem(SOCKET_ID_KEY, this.socket.id);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    localStorage.removeItem(SOCKET_ID_KEY);
  }

  reconnectWithFreshAuth() {
    this.disconnect();
    this.connect();
  }

  on<T>(event: string, cb: (data: T) => void) {
    this.socket?.on(event, cb);
  }

  off(event: string) {
    this.socket?.off(event);
  }

  emit<T>(event: string, data?: T) {
    this.socket?.emit(event, data);
  }

  get id() {
    return this.socket?.id ?? null;
  }

  get connected() {
    return this.socket?.connected ?? false;
  }
}

export default new SocketClient();
