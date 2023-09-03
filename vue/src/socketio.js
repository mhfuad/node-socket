import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:8000');
let socket_id = null;

socket.on("connect", ()=>{
    console.log("connected")
    socket_id = socket.id
    console.log(socket_id)
})

const SocketPlugin = {
  install: (app) => {
    app.config.globalProperties.$socket = socket;
    app.config.globalProperties.$socket_id = 0;

    setTimeout(()=>{
        app.config.globalProperties.$socket_id = socket_id;
    },1000)
  },
};

export default SocketPlugin;