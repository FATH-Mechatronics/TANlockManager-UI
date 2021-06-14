import {Socket} from "socket.io-client";

export {}

declare global {
  namespace SocketIOClient {
    interface MySocket extends Socket{
      doReconnect?: boolean;
    }
  }
}
