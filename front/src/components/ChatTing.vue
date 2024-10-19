<script setup>
  import { io } from 'socket.io-client';
  import { onMounted, ref } from 'vue';

  const roomsocket = io('http://localhost:8000/room');

  const Text = ref('');
  const messages = ref([]);
  const messageStacks = ref({});
  const currentRoom = ref('');   // 현재 방

  // 방에 입장하는 함수
  const joinRoom = (roomId) => {
    currentRoom.value = roomId;
    if (!messages.value[roomId]) {
      messages.value[roomId] = [];
    }
    if (!messageStacks.value[roomId]) {
      messageStacks.value[roomId] = 0;
    }
    roomsocket.emit('joinRoom', roomId); // 서버에 방 입장 요청
  };

  // 컴포넌트가 마운트될 때 기본 방에 입장
  onMounted(() => {
    const generateRandomRoomName = (length) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      return result;
    }
    const roomName = generateRandomRoomName(8);
    // 방이름
    joinRoom(roomName);
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
  };
  
  roomsocket.on('connect', () => {
    console.log('Connected to server');

  });
  roomsocket.on('receive', (data) => {
    console.log(data);
    
    const { message, room, stack } = data;
    console.log('1',message.value);
    console.log('2', message.value[room]);
    
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

<template>
  <p>상대방이름</p>
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>
  <ul>
    <li v-for="(message, index) in messages[currentRoom]" :key="index">{{ message }}</li>

  </ul>
</template>