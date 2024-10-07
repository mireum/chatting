<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <!-- <input v-model="Text" />
  <button @click="sendMessage">Send a message</button> -->
</template>


<script setup>
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

socket.on('connect', () => {
  console.log('Connected to server');
  // 서버에 message라는 이벤트와 메시지를 보냄
  socket.emit('message', 'Hi! i am client');
});
// 서버에서 'message' 이벤트가 발생했을 때 실행되는 이벤트 핸들러
socket.on('message', (message) => {
  console.log(`Received message: ${message}`);
});
</script> 


<script>

export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      Text : '',
    }
  }
}
</script>

<style>

</style>
