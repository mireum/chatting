<script setup>
  import { io } from 'socket.io-client';
  import { onMounted, ref, defineProps } from 'vue';
  
  const roomsocket = io('http://localhost:8000/room');

  const Text = ref('');
  const userId = ref('');
  const messages = ref([]);
  const messageStacks = ref({});
  const currentRoom = ref('');   // 현재 방
  const props = defineProps({
    roomId: String,
  });

  // 방에 입장하는 함수
  const joinRoom = (roomId) => {
    // messages 객체에는 user떼고 이름으로 저장함
    const roomName = roomId.split('_')[0] + roomId.split('_')[1];

    if (!messageStacks.value[roomName]) {
      messages.value[roomName] = [];
      messageStacks.value[roomName] = 0;
    }
    let stack = messageStacks.value[roomName]; 
    roomsocket.emit('joinRoom', { roomId, stack }); // 서버에 방 입장 요청
  };

  // 컴포넌트가 마운트될 때 기본 방에 입장
  onMounted(() => {
    // url에 있는 roomName+user 저장
    const roomId = props.roomId;
    const roomName = roomId.split('_')[0] + roomId.split('_')[1];
    currentRoom.value = roomName;
    userId.value = roomId.split('_')[2];
    // user 알려줘야하므로 원래 url 보내줌
    joinRoom(roomId);
  });

  // 서버로 메시지를 보내는 함수
  const sendMessage = () => {
    if (Text.value.trim() !== '') {
      messages.value[currentRoom.value].push({text:Text.value, opposit: false});
      
      roomsocket.emit('message', { message: Text.value, user:userId.value });
      console.log(`Sent message: ${Text.value}`);
      Text.value = '';
      messageStacks.value[currentRoom.value] += 1;
    }
  };
  
  roomsocket.on('connect', () => {
    console.log('Connected to server');
  });

  roomsocket.on('enterRoom', (data) => {
    const { roomMessages, roomStack } = data;
    // console.log('roomMessages', roomMessages);
    // console.log('메시지목록', messages.value[currentRoom.value]);
    roomMessages.forEach((message) => {      
      if (message.user== userId.value) {
        messages.value[currentRoom.value].push({ text: message.text, opposit: false });
      }
      else {
        messages.value[currentRoom.value].push({ text: message.text, opposit: true });
      }
    });
    // console.log('새로운메시지목록', messages.value[currentRoom.value]);
    messageStacks.value[currentRoom.value] = roomStack;
  });

  roomsocket.on('receive', (data) => {
    const { message, roomName } = data;
    messages.value[roomName].push({ ...message, opposit: true });
    messageStacks.value[roomName] += 1;
  });

</script> 

<template>
  <p>상대방이름</p>
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>
  <ul>
    <li 
      v-for="(message, index) in messages[currentRoom]" 
      :key="index"
      :class="{ 'opposit-message': message.opposit, 'my-message': !message.opposit }"
    >
    {{ message.text }}
    </li>
  </ul>
</template>

<style>
.opposit-message {
  background-color: #f1f1f1;
  text-align: left;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  max-width: 60%;
  align-self: flex-start; /* 왼쪽 정렬 */
}

.my-message {
  background-color: #dcf8c6;
  text-align: right;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
  max-width: 60%;
  align-self: flex-end; /* 오른쪽 정렬 */
}

</style>