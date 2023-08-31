<template>
    <div class="about">
      <h3>socket id: {{ socket_id }}</h3>
      <input type="text" v-model="user_id" placeholder="user id">
      <button @click="join_custom_room">join</button>

      <p>user list</p>
      <ul>
        <li v-for="item in current_user" :key="item">{{ item }}</li>
      </ul>
      <h3>Notifications</h3>
      <ul>
        <li v-for="item in notifications" :key="item">{{ item.userId }} => {{ item.notification }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import io from 'socket.io-client';
  export default {
    name: 'SocketView',
    data(){
      return {
        socket: null,
        socket_id:'',
        user_id:'',
        current_user: '',

        notifications: {}
      }
    },
    methods: {
      join_custom_room(){
        this.socket.emit('user-connected', this.user_id, this.socket_id)
        this.user_id = '';
      }
    },
    mounted(){
      this.socket = io('http://127.0.0.1:8000');

      this.socket.on("connect", ()=>{
        this.socket_id = this.socket.id
      })

      this.socket.on("notification", (respon)=>{
        this.notifications = respon
      })

      this.socket.on("current_user", (ress)=>{
        this.current_user = ress
      })

      this.socket.on("getMessage", (res) => {
        console.log(res)
      })

    }
  }
  </script>
  