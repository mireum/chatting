<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>

  <div>
    <h3>Messages:</h3>
    <ul>
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
  </div>
</template>


<script setup>
  import { io } from 'socket.io-client';
  import { ref } from 'vue';
  // io는 io.connect()의 단축형이다.
  // const socket = io('http://localhost:8000');
  const roomsocket = io('http://localhost:8000/room');

  // socket.on('connect', () => {
  //   console.log('Connected to server');
  //   // 서버에 message라는 이벤트와 메시지를 보냄
  //   socket.emit('message', 'Hi! i am client');
  // });

  // socket.on('message', (message) => {
  //   console.log(`Received message: ${message}`);
  //   messages.value.push(message);
  // });

  const Text = ref('');
  const messages = ref([]);

  // 서버로 메시지를 보내는 함수
  const sendMessage = () => {
    if (Text.value.trim() !== '') {
      roomsocket.emit('message', Text.value); // 서버로 입력된 메시지 전송
      console.log(`Sent message: ${Text.value}`);
      Text.value = ''; // 메시지 보낸 후 입력 필드 초기화
    }
  }
  
  roomsocket.on('connect', () => {
    console.log('Connected to server');
    // 서버에 message라는 이벤트와 메시지를 보냄
    // roomsocket.emit('message', 'Hi! i am client');
  });

  roomsocket.on('message', (message) => {
    console.log(`Received room message: ${message}`);
    messages.value.push(message);
  });
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
