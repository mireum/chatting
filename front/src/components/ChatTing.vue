<script setup>
  import { io } from 'socket.io-client';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  const roomsocket = io('http://localhost:8000/room');

  const route = useRoute();
  const Text = ref('');
  const messages = ref([]);
  const messageStacks = ref({});
  const currentRoom = ref('');   // 현재 방

  // 방에 입장하는 함수
  const joinRoom = (roomId) => {
    // messages 객체에는 user땐 이름으로 저장함
    const roomName = roomId.split('_')[0] + roomId.split('_')[1];
    if (!messages.value[roomName]) {
      messages.value[roomName] = [];
    }
    if (!messageStacks.value[roomName]) {
      messageStacks.value[roomName] = 0;
    }
    roomsocket.emit('joinRoom', roomId); // 서버에 방 입장 요청
  };

  // 컴포넌트가 마운트될 때 기본 방에 입장
  onMounted(() => {
    // url에 있는 roomName+user 저장
    const roomId = route.params.roomId;
    const roomName = roomId.split('_')[0] + roomId.split('_')[1];
    console.log('roomName: ', roomName);
    currentRoom.value = roomName;
    // user 알려줘야하므로 원래 url 보내줌
    joinRoom(roomId);
  });

  // 서버로 메시지를 보내는 함수
  const sendMessage = () => {
    if (Text.value.trim() !== '') {
      messages.value[currentRoom.value].push(Text.value);
      
      roomsocket.emit('message', {
        message: Text.value,
        stack: messageStacks.value[currentRoom.value]
      });
      console.log(`Sent message, roomId, stack: 
      ${Text.value} ${messageStacks.value[currentRoom.value]}`);
      Text.value = '';
      messageStacks.value[currentRoom.value] += 1;
    }
  };
  
  roomsocket.on('connect', () => {
    console.log('Connected to server');
  });

  roomsocket.on('enterRoom', (data) => {
    const { roomMessages, roomStack } = data;
    console.log('roomMessages', roomMessages);
    console.log('roomStack', roomStack);
    console.log('메시지목록', messages.value[currentRoom.value]);
    roomMessages.forEach((message) => {
      messages.value[currentRoom.value].push(Object.values(message)[0]);
    });
    messageStacks.value[currentRoom.value] = roomStack;
  });

  roomsocket.on('receive', (data) => {
    console.log(data);
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

<template>
  <p>상대방이름 {{ roomName }}</p>
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>
  <ul>
    <li v-for="(message, index) in messages[currentRoom]" :key="index">{{ message }}</li>

  </ul>
</template>