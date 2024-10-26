<script setup>
import { messageStacks } from '@/chatView';
import axios from 'axios';
import { defineProps, defineEmits, onMounted, ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  userCard: {
    type: Object,
    required: true
  },
});

const emit = defineEmits(['startChat']);
const roomName = ref('');
roomName.value = (() => {
  const user = String(props.user.id);
  const userCard = String(props.userCard.id);
  return user >= userCard ? `${user}${userCard}` : `${userCard}${user}`;
})();
const unreadMessage = ref(0);

const generateRoomName = () => {
  const user = String(props.user.id);
  const userCard = String(props.userCard.id);
  emit('startChat');
  return user >= userCard ? `${user}_${userCard}_${user}` : `${userCard}_${user}_${user}`;
};

onMounted( async () => {
  try {
    let stack = 0;
    if (messageStacks.value[roomName.value]) {
      stack = messageStacks.value[roomName.value];
    }
    const unread = await axios.post(`${process.env.VUE_APP_server_url}/unreadMessage`, {stack, roomName:roomName.value});
    unreadMessage.value = unread.data.unreadStack || 0;
  } catch (error) {
    console.error(error);
  }
})
</script>

<template>
  <div class="userBox">
    <div class="profileBox">
      <img class="profileImg" :src="props.userCard.profile_image" alt="profile_img" />
      <p>{{ props.userCard.name }}</p>
      <p v-if="unreadMessage !== 0">읽지 않은 메시지: {{ unreadMessage }}</p>
    </div>
    <div class="chatBtnBox">
      <button class="chatBtn" @click="() => {$router.push(`/${generateRoomName()}`)}">채팅하기</button>
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 10px;
}
.profileBox:first-child >p {
  text-align: center;
  width: 200px;
}
.profileBox >p:nth-child(3) {
  background-color: #e73803;
  color: #fff;
  border-radius: 10px;
}
.profileImg {
  width: 70px;
  height: auto;
  border-radius: 50%;
}
.chatBtnBox {
  padding-right: 16px;
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