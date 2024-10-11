<template>
  <div>
    <h2>Naver Login</h2>
    <div>
      <p>email: {{ email }}</p>
      <p>nickname: {{ nickname }}</p>
    </div>
    <!-- <button v-if="!accessToken" @click="naverLogin">로그인</button> -->
    <button type="button" @click="logout">로그아웃</button>
  </div>
</template>

<script>
import axios from "axios";
// import router from "@/router";

const clientId = "dV_7BO34dzC4GTolRjVY";
const clientSecret = "dwgkrDT_AO";

export default {
  data() {
    return {
      accessToken: "",
      email: "",
      nickname: "",
    };
  },
  mounted() {
    // this.naverLogin = new window.naver_id_login(clientId);
    // this.accessToken = this.naverLogin.oauthParams.access_token;
    // this.userInfo();
    if (window.naver_id_login) {
      this.naverLogin = new window.naver_id_login(clientId);

      // oauthParams가 유효한지 확인
      if (this.naverLogin.oauthParams.access_token) {
        this.accessToken = this.naverLogin.oauthParams.access_token;
        this.userInfo();
      } else {
        console.error('Access token is undefined');
      }
    } else {
      console.error('Naver SDK not loaded');
    }
  },
  methods: {
    // naverLogin() {
    //   if (window.naver_id_login) {
    //     this.naverLogin = new window.naver_id_login(clientId);

    //     // 로그인이 성공하면 accessToken을 가져옴
    //     this.naverLogin.get_naver_userprofile(async () => {
    //       this.accessToken = this.naverLogin.oauthParams.access_token;
    //       if (this.accessToken) {
    //         this.userInfo(); // 사용자 정보 가져오기
    //       } else {
    //         console.error("Access token is undefined");
    //       }
    //     });
    //   } else {
    //     console.error("Naver SDK not loaded");
    //   }
    // },
    // 사용자 프로필 조회
    async userInfo() {
      const url = `/v1/nid/me`;
      // const url = `https://openapi.naver.com/v1/nid/me`;
      let header = "Bearer " + this.accessToken;
      const headers = { Authorization: header };
      console.log('headers', headers);
      
      const { data } = await axios.get(url, { headers });
      console.log("userInfo: ", data);
      this.email = data.response.email; // 이메일
      this.nickname = data.response.nickname; // 별명
    },
    
    // 로그인 연동 해제 샘플
    logout() {
      const url = `/oauth2.0/token?grant_type=delete&client_id=${clientId}&client_secret=${clientSecret}&access_token=${this.accessToken}&service_provider=NAVER`;

      axios.get(url).then((res) => {
        console.log(res.data);
        // router.push({ path: "login" });
      });
    },
  },
};
</script>