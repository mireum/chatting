<template>
  <div>
    <div class="userBox">
      <div class="profileBox">
        <img class="profileImg" :src="user.profile_image" />
        <p>{{ user.name }}</p>
      </div>
      <div>
        <button class="chatBtn">채팅하기</button>
      </div>
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
}
.profileBox {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.profileImg {
  width: 70px;
  height: auto;
  border-radius: 50%;
}
.chatBtn {
  width: 100px;
  height: 40px;
  border: none;
  border-radius: 20px;
}
</style>