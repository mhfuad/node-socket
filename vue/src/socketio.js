import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:8001');
let socket_id = null;

socket.on("connect", ()=>{
    console.log("connected")
    socket_id = socket.id
    console.log(socket_id)
})

const SocketPlugin = {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
    app.config.globalProperties.$socket_id = socket_id;
  },
};

export default SocketPlugin;