<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <input v-model="Text" />
  <button @click="sendMessage">Send a message</button>
</template>


<script setup>
// import { inject, ref } from "vue";
import { ref } from "vue";
// import { onMessage, onOpen, onClose, onError } from "vue3-websocket";

// const text = ref('');
const responseMsg = ref('');
// const socket = inject('socket');
// const sendMessage = () => socket.value.send(text.value);
const ws = new WebSocket('wss://localhost:8000');
// 혹은 http ssl이 아니라면
// const ws = new WebSocket('ws://example.com');

ws.onopen = (event) => {
  console.log(event);
  console.log('WebSocket connection is stable!');  
}
ws.onmessage = (message) => {
  responseMsg.value = message.data;
  console.log('Got a message from the WebSocket: ', message);
};
ws.onclose = (event) => {
  console.log(event);
  console.log('Connection has been closed');
};
ws.onerror = (error) => {
  console.error('WebSocket error: ', error);
};
</script> 


<script>

export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>

</style>
