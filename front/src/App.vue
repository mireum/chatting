<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>
</template>


<script setup>
import { io } from 'socket.io-client';
import { ref } from 'vue';
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

const Text = ref('');

// 서버로 메시지를 보내는 함수
const sendMessage = () => {
  if (Text.value.trim() !== '') {
    socket.emit('message', Text.value); // 서버로 입력된 메시지 전송
    console.log(`Sent message: ${Text.value}`);
    Text.value = ''; // 메시지 보낸 후 입력 필드 초기화
  }
}
</script> 


<script>

export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      
    }
  }
}
</script>

<style>

</style>
