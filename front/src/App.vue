<script setup>
import { ref } from 'vue';
import HeaderComp from './components/HeaderComp.vue';
import UserList from './components/UserList.vue';
import axios from 'axios';
import { RouterView } from 'vue-router';
import { chatView } from './chatView';

const user = ref(null);
const chatList = ref(null);
const refreshInterval = 3000; // 3초마다

const showChatView = () => {
  chatView.value = true;
}
const startPollingUserList = () => {
  setInterval(async () => {
    await getUserList();
  }, refreshInterval);
};
const getUserList = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_server_url}/userList`);
    
    // 나는 빼고 chatList에 넣기
    const list = Object.values(res.data.userList)
    chatList.value = list.filter(u => u.id !== user.value.id);
  } catch (err) {
    console.error(err);
  }
};

const handleUser = (userInfo) => {
  // userInfo는 현재 사용자
  user.value = userInfo;
  // 이건 받아올 다른 사용자
  getUserList();
  startPollingUserList();
}
</script>

<template>
  <HeaderComp @isLogin="handleUser"></HeaderComp>
  <div class="container">
    <div v-if="!user">
      <h2 class="announceH2">로그인 후 이용해주세요!</h2>
    </div>
    <div v-else>
      <div v-if="!chatView">
        <div class="chatTitle">Chats</div>
        <p class="chatP">접속 중인 사용자</p>
        <ul>
          <li class="userLi" v-for="(userCard, index) in chatList" :key="index">
            <UserList :userCard="userCard" :user="user" @startChat="showChatView" />
          </li>
        </ul>
      </div>
      <RouterView v-if="chatView" />
    </div>
  </div>
</template>

<style>
.container {
  width: 1200px;
  margin: 0 auto;
}
.announceH2 {
  text-align: center;
  padding: 280px 0px;
}
.chatTitle {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
}
.chatP {
  font-weight: bold;
  text-align: center;
  margin: 0px 0px 30px 0px;
}
.userLi {
  list-style-type: none;
  margin-bottom: 20px;
}
.userLi:last-child {
  margin-bottom: 0;
}
</style>

