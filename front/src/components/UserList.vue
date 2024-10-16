<script setup>
import { ref, defineProps } from 'vue';
import io from 'socket.io-client';

// const roomsocket = io('http://localhost:8000/room');

const props = defineProps({
  userCard: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
});
console.log(props.user);

// const socket = ref(null);
const roomId = ref('room1');

const joinRoom = (otherUserId) => {
  const socket = io('http://localhost:8000/room');
  socket.emit('joinRoom', { roomId, userId:props.userCard.id, otherUserId });
};
</script>

<template>
  <div class="userBox">
    <div class="profileBox">
      <img class="profileImg" :src="props.userCard.profile_image" alt="profile_img" />
      <p>{{ props.userCard.name }}</p>
    </div>
    <div class="chatBtnBox">
      <button class="chatBtn" @click="joinRoom('roomId', props.userCard.id)">채팅하기</button>
    </div>
  </div>
</template>

<style>
.userBox {
  width: 800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  border: 2px solid #ccc;
  border-radius: 18px;
  padding: 14px;
}
.profileBox {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 10px;
}
.profileImg {
  width: 70px;
  height: auto;
  border-radius: 50%;
}
.chatBtnBox {
  padding-right: 20px;
}
.chatBtn {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 20px;
  background-color: #00c180;
  cursor: pointer;
}
</style>