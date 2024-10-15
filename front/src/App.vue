<template>
  <HeaderComp @isLogin="handleUser"></HeaderComp>
  <div class="container">

    <div v-if="!user">
      <h2 class="announceH2">로그인 후 이용해주세요!</h2>
    </div>
    <div v-else>
      <div v-if="user">
        <div>Chats</div>
        <ul>
          <!-- <li v-for="(message, index) in messages[currentRoom]" :key="index">{{ message }}</li> -->
          <UserList :user="user" />
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import HeaderComp from './components/HeaderComp.vue';
import UserList from './components/UserList.vue';
import axios from 'axios';

const user = ref(null);
const chatList = ref(null);

const getUserList = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/userList`);
    console.log('리스폰스', res);
    chatList.value = res;
    console.log('챗리스트', chatList);
    console.log('챗리스트밸류', chatList.value);
    console.log('유저', user);
    
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  getUserList();
})

const handleUser = (userInfo) => {
      user.value = userInfo;
    }
</script>
<!-- <script>
import HeaderComp from './components/HeaderComp.vue';
import UserList from './components/UserList.vue';

export default {
  name: 'App',
  components: {
    HeaderComp,
    UserList,
  },
  data() {
    return {
      user: null,
      chatList: null,
    }
  },
  methods: {
    handleUser(user) {
      this.user = user;
    }
  },
}
</script> -->

<style>
.container {
  width: 1200px;
  margin: 0 auto;
}
.announceH2 {
  text-align: center;
  padding: 280px 0px;
}
</style>
