import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SocketPlugin from './socketio.js';

createApp(App).use(router).use(SocketPlugin).mount('#app')

