<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>

  <div>
    <h3>Messages in {{ currentRoom }}:</h3>
    <ul>
      <li v-for="(message, index) in messages[currentRoom]" :key="index">{{ message }}</li>
    </ul>
  </div>
</template>


<script setup>
  import { io } from 'socket.io-client';
  import { onMounted, ref } from 'vue';

  const roomsocket = io('http://localhost:8000/room');

  const Text = ref('');
  const messages = ref([]);
  const messageStacks = ref({});
  const currentRoom = ref('general');   // 현재 방

  // 방에 입장하는 함수
  const joinRoom = (room) => {
    currentRoom.value = room;
    if (!messages.value[room]) {
      messages.value[room] = [];
    }
    if (!messageStacks.value[room]) {
      messageStacks.value[room] = 0;
    }
    roomsocket.emit('joinRoom', room); // 서버에 방 입장 요청
  };

  // 컴포넌트가 마운트될 때 기본 방에 입장
  onMounted(() => {
    joinRoom('general');
  });

  // 서버로 메시지를 보내는 함수
  const sendMessage = () => {
    if (Text.value.trim() !== '') {
      messages.value[currentRoom.value].push(Text.value);
      console.log(messages.value);
      console.log(messageStacks.value);
      
      
      roomsocket.emit('message', {
        message: Text.value,
        room: currentRoom.value,
        stack: messageStacks.value[currentRoom.value]
      });
      console.log(`Sent message, room, stack: 
      ${Text.value} ${currentRoom.value} ${messageStacks.value[currentRoom.value]}`);
      Text.value = '';
      messageStacks.value[currentRoom.value] += 1;
    }
  }
  
  roomsocket.on('connect', () => {
    console.log('Connected to server');
    // 서버에 message라는 이벤트와 메시지를 보냄
    // roomsocket.emit('message', 'Hi! i am client');
  });

  roomsocket.on('message', (data) => {
    const { message, room, stack } = data;
    if (!messages.value[room]) {
      messages.value[room] = [];
    }
    messages.value[room].push(message);
    messageStacks.value[room] = stack;  // 서버의 스택 번호로 업데이트
    console.log(`Received room message, room, stack: ${message} ${room} ${stack}`);
  });

  roomsocket.on('updateMessages', (data) => {
    const { room, newMessages } = data;
    console.log(`Updating messages for room: ${room}`);
    messages.value[room] = newMessages;
    messageStacks.value[room] = newMessages.length; // 스택 맞춤
    messages.value[currentRoom.value].push(Text.value);
    Text.value = '';
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
