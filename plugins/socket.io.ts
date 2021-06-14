import {io, Socket} from "socket.io-client";


const ACCESS_TOKEN = "ACCESS_TOKEN";

const basePort = 4343;
const baseURL = `${location.protocol.replace("http", "ws")}//${location.hostname}:${basePort}/`;

class MySocket {
  constructor(socket: Socket) {
    this.socket = socket;
  }
  public socket: Socket;
  public doReconnect: boolean = false;
}

const socket = io(baseURL);
const mySocket = new MySocket(socket);

function connectToWs() {
  socket.on('authenticated', function () {
    console.log("Authed to Socket ;D");
  });
  socket.on('unauthorized', function (err) {
    console.log("There was an error with the authentication:", err.message);
    if (err.message === "SocketAuth Token Invalid") {
      mySocket.doReconnect = false;
    }
  });
  socket.on('disconnect', () => {
    if (mySocket.doReconnect) {
      console.log("Disconnect, RECONNECT in .5 Sec");
      setTimeout(() => socket.open(), 500);
    } else {
      console.log("Reconnect Forbidden");
    }
  });
  socket.on('connect', function () {
    socket.emit('authentication', {token: localStorage.getItem(ACCESS_TOKEN)});
    mySocket.doReconnect = true;
  });
}

connectToWs();
import {Plugin} from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $socketio: MySocket
  }
}

declare module '@nuxt/types' {
  interface Context {
    $socketio: MySocket
  }
}

const socketioPlugin: Plugin = (context, inject) => {
  inject('socketio', mySocket);
};

export default socketioPlugin;
