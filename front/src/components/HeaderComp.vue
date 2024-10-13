<template>
  <header>
    <div class="logoBox">
      <img alt="Vue logo" src="../assets/logo.png" />
    </div>
    <div class="loginBox">
      <KakaoLogin @loginSuccess="handleKakaoLogin" />
      <NaverLogin />
    </div>
  </header>
</template>

<script>
import KakaoLogin from './KakaoLogin.vue';
import NaverLogin from './NaverLogin.vue';

export default {
  data() {
    return {
      user: null,
    }
  },
  components: {
    KakaoLogin, NaverLogin
  },
  methods: {
    handleKakaoLogin(user) {
      this.user = user;
    }
  }
}
</script>

<style>
header {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logoBox {
  width: 50px;
  height: 50px;
}
.logoBox img {
  max-width: 100%;
  max-height: 100%;
  /* object-fit: contain; */
}
.loginBox {
  display: flex;
  gap: 24px;
}
</style>