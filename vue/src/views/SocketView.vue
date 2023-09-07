<template>
    <div class="about">
    
      <h3>User id: {{ user_id }}</h3>
      <input type="text" v-model="user_id" placeholder="user id">
      <button @click="join_custom_room">join</button>

      <p>user list</p>
      <ul>
        <li v-for="item in current_user" :key="item">{{ item }}</li>
      </ul>
      <h3>Notifications</h3>
      
      <button @click="getNotificationList()">{{ notifications_count }}</button><br />
      <ul>
        <li v-for="item in notifications" :key="item.id" @click="updateNotification(item.id)">{{ item.userId }} => {{ item.notification }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  import axio from "axios";
  export default {
    
    name: 'SocketView',
    data(){
      return {
        socket: null,
        socket_id:'',
        user_id:'',
        current_user: '',
        notifications_count: 0,
        notifications: {}
      }
    },
    methods: {
      join_custom_room(){
        this.$socket.emit('user-connected', this.user_id)
        localStorage.setItem("user_id", this.user_id)
        //this.user_id = '';
      },
      getNotificationList(){
        this.notifications_count = 0
        const user_id = localStorage.getItem("user_id")
        axio.get("http://localhost:8001/notification/"+user_id)
        .then((res)=>{
          this.notifications = res.data
        })
        .catch()
      },
      updateNotification(id){
        axio.put("http://localhost:8001/notification/"+id)
        .then((res)=>{
          //console.log(res)
        })
        .catch()
      }
    },
    mounted(){

      this.$socket.on("current_user", (ress)=>{
        this.current_user = ress
      })

      this.$socket.on("getNotificationCount", (res) => {
        this.notifications_count = res
      })

      this.$socket.on('custom-event-test', (res)=>{
        alert(res)
      })
    },
    beforeCreate(){
      localStorage.removeItem("user_id");
    },
    unmounted(){
      localStorage.removeItem("user_id");
    },
    destroyed(){
      localStorage.removeItem("user_id");
    }
  }
  </script>
  