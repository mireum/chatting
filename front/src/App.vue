<template>
  <HeaderComp @isLogin="handleUser"></HeaderComp>
  <div class="container">

    <div v-if="!user">
      <h2 class="announceH2">로그인 후 이용해주세요!</h2>
    </div>
    <div v-else>
      <div v-if="user">
        <div class="chatTitle">Chats</div>
        <p class="chatP">접속 중인 사용자</p>
        <ul>
          <li class="userLi" v-for="(userCard, index) in chatList" :key="index">
            <UserList :userCard="userCard" :user="user" />
          </li>
        </ul>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HeaderComp from './components/HeaderComp.vue';
import UserList from './components/UserList.vue';
import axios from 'axios';
// import { io } from 'socket.io-client';
import { RouterView } from 'vue-router';

const user = ref(null);
const chatList = ref(null);
const refreshInterval = 3000; // 5초마다

const startPollingUserList = () => {
  setInterval(async () => {
    await getUserList(); // 사용자 리스트 불러오기
  }, refreshInterval);
};
const getUserList = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/userList`);
    
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
  // socket 연결
  // const socket = io('http://localhost:8000/');
  startPollingUserList();
}
</script>

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

