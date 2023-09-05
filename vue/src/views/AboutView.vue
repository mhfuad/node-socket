<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="clicked">{{ count }}</button>
    <button @click="custom">custom</button> <br/>
    <p>Public message</p>
    <input v-model="text" type="text" placeholder="message"/>
    <button @click="message">message</button> <br/>
    
    <textarea name="" id="" cols="80" rows="10" v-model="message_test"></textarea><br />
    <p>Private message</p>
    <p>Socket Id: {{ socket_id }}</p>
    <input v-model="room" type="text" placeholder="room"/>
    <input v-model="text2" type="text" placeholder="message"/>
    <button @click="toUser">message to a user</button> <br/>
    
    <textarea name="" id="" cols="80" rows="10" v-model="user_message"></textarea><br />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import io from 'socket.io-client';
export default {
  name: 'AboutView',
  data(){
    return {
      socket_id:'',
      count:0,
      socket: null,
      text:'',
      message_test: '',
      room:'',
      text2:'',
      user_message:'',
    }
  },
  methods: {
    clicked(){
      this.$socket.emit('liked');
    },
    custom(){
      this.$socket.emit('custom-event', 10, 'h1', {a: 'a'})
    },
    message(){
      this.$socket.emit('send-message', this.text)
      this.text = '';
    },
    toUser(){
      this.$socket.emit('send_to', this.text2, this.room)
      this.text2 = '',
      this.room = ''
    }
  },
  mounted(){
    this.$socket.on("likeupdate", (count) => {
        this.count = count;
    })
    this.$socket.on('receive-message', (bal) => {
      this.message_test += bal
    })
    this.$socket.on('user_message', (message)=>{
      this.user_message += message;
    })
    this.$socket.on('notification', (message)=>{
      console.log(message)
    })
  }
}
</script>
