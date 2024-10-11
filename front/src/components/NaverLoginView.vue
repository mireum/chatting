<template>
  <div>
    <!-- 네이버 로그인 버튼 노출 영역 -->
    <div id="naver_id_login"></div>
    <!-- <NaverLogin /> -->
  </div>
</template>

<script>
// import NaverLogin from './NaverLogin.vue';

const clientId = "dV_7BO34dzC4GTolRjVY";

export default {
  components: {
    // NaverLogin
  },
  data() {
    return {};
  },
  mounted() {
    this.naverLogin = new window.naver_id_login(
      clientId,
      "http://localhost:8080/"  // 개발자센터에서 등록한 Callback URL
    );
    var state = this.naverLogin.getUniqState();
    this.naverLogin.setButton("white", 2, 40); // 버튼설정
    this.naverLogin.setDomain("http://localhost:8080");
    this.naverLogin.setState(state);
    this.naverLogin.setPopup(); // 팝업 여부
    this.naverLogin.init_naver_id_login();
  },
};
</script>