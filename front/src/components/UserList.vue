<script setup>
import { defineProps } from 'vue';

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

const generateRoomName = () => {
  const user = String(props.user.id);
  const userCard = String(props.userCard.id);
  if (user >= userCard) return user+'_'+userCard+'_'+user;
  else return userCard+'_'+user+'_'+user;
};
</script>

<template>
  <div class="userBox">
    <div class="profileBox">
      <img class="profileImg" :src="props.userCard.profile_image" alt="profile_img" />
      <p>{{ props.userCard.name }}</p>
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