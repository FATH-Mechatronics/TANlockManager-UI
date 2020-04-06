export {}

declare global {
  namespace SocketIOClient {
    interface Socket {
      doReconnect?: boolean;
    }
  }
}
