<script setup>
  import { io } from 'socket.io-client';
  import { onMounted, ref, defineProps, nextTick } from 'vue';
  
  const roomsocket = io(`${process.env.VUE_APP_server_url}/room`);

  const Text = ref('');
  const userId = ref('');
  const messages = ref([]);
  const messageStacks = ref({});
  const currentRoom = ref('');   // 현재 방
  const props = defineProps({
    roomId: String,
  });
  const chatUlRef = ref(null);
  const scrollToBottom = () => {
    const chatUl = chatUlRef.value;
    if (chatUl) {
      chatUl.scrollTop = chatUl.scrollHeight; // 스크롤을 최하단으로 이동
    }
  };

  // 방에 입장하는 함수
  const joinRoom = (roomId) => {
    // messages 객체에는 user떼고 이름으로 저장함
    const roomName = roomId.split('_')[0] + roomId.split('_')[1];

    if (!messageStacks.value[roomName]) {
      messages.value[roomName] = [];
      messageStacks.value[roomName] = 0;
    }
    let stack = messageStacks.value[roomName]; 
    roomsocket.emit('joinRoom', { roomId, stack });
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
      roomsocket.emit('message', { message: Text.value, user:userId.value });
      console.log(`Sent message: ${Text.value}`);
      Text.value = '';
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
      console.log(message);
           
      if (message.user== userId.value) {
        messages.value[currentRoom.value].push({ ...message, opposit: false });
      }
      else {
        messages.value[currentRoom.value].push({ ...message, opposit: true });
      }
    });
    messageStacks.value[currentRoom.value] = roomStack;
    nextTick(() => {
      scrollToBottom();
    });
  });

  roomsocket.on('mirror', (data) => {
    console.log(data);
    
    const { message, roomName } = data;
    messages.value[roomName].push({ ...message, opposit: false });
    messageStacks.value[roomName] += 1;
    nextTick(() => {
      scrollToBottom();
    });
  });

  roomsocket.on('receive', (data) => {
    const { message, roomName } = data;
    messages.value[roomName].push({ ...message, opposit: true });
    messageStacks.value[roomName] += 1;
    nextTick(() => {
      scrollToBottom();
    });
  });

</script> 

<template>
  <div class="chatContainer">
    <div class="chatBox">
      <ul class="chatUl" ref="chatUlRef">
        <li class="chatLi chatWindow" 
          v-for="(message, index) in messages[currentRoom]" 
          :key="index"
          :class="{ 'opposit-message': message.opposit, 'my-message': !message.opposit }"
        >
          <div class="message-name">{{ message.name }}</div>
          <div class="message-text">{{ message.text }}
            <span class="message-time">{{ message.time }}</span>
          </div>
        </li>
      </ul>
      <div class="chatInputBox">
        <input class="chatInput" placeholder="메시지를 입력하세요" v-model="Text" v-on:keyup.enter="sendMessage"/>
        <button class="chatSendBtn" @click="sendMessage">보내기</button>
      </div>
    </div>
  </div>
</template>

<style>
.chatContainer {
  width: 1200px;
}
.chatBox {
  width: 800px;
  margin: 0 auto;
}
.chatUl {
 display: flex; 
 flex-direction: column;
 max-height: 500px;
 overflow-y: auto;
 -ms-overflow-style: none;
 margin: 40px 0px;
}
.chatUl::-webkit-scrollbar {
  display: none;
}
.chatLi {
  list-style-type: none;
}
.chatWindow {
  display: inline-block;
  border-radius: 10px;
  margin: 10px 0;
  max-width: 60%;
  letter-spacing: 1px;
  padding: 10px 20px 10px 20px;
}
.opposit-message {
  align-self: flex-start;
}
.my-message {
  align-self: flex-end;
}
.chatInputBox {
  width: 800px;
  display: flex;
  height: 2.3rem;
}
.chatInput {
  width: 600px;
  font-size: 16px;
  flex: 1;
  margin-left: 30px;
  border: 1px solid #aaa;
  border-radius: 10px 0px 0px 10px;
  border-right: none;
  padding: 10px 14px;
}
.chatInput:focus {
  outline: none;
}
.chatSendBtn {
  background-color: rgba(95, 177, 180, 0.473);
  width: 100px;
  border: 1px solid #aaa;
  border-radius: 0px 10px 10px 0px;
  cursor: pointer;
}
.chatSendBtn:hover {
  background-color: indianred;
}
.message-name {
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #333;
  background-color: transparent;
}
.message-text {
  font-size: 1rem;
  padding: 5px 0;
  padding: 10px 20px;
  border-radius: 10px;
  display: inline-block;
}
.opposit-message .message-text {
  background-color: #f1f1f1;
  text-align: left;
}
.my-message .message-text {
  background-color: #dcf8c6;
  text-align: right;
}
.opposit-message .message-name {
  text-align: left;
}
.my-message .message-name {
  text-align: right;
}
.message-time {
  font-size: 0.8rem;
  color: gray;
  margin-left: 10px;
}
</style>