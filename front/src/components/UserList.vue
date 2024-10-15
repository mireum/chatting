<template>
  <div class="userBox">
    <div class="profileBox">
      <img class="profileImg" :src="user.profile_image" />
      <p>{{ user.name }}</p>
    </div>
    <div class="chatBtnBox">
      <button class="chatBtn">채팅하기</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {

  },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

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
}
</style>