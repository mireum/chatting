<template>
  <div>
    <a v-if="user.name == undefined" class="btn" @click="kakaoLogin">
      <img src="../assets/kakao_login_small.png" />
    </a>
    <div v-else class="inLoginBox btn">
      <p><strong>{{ user.name }}</strong> 님</p>
      <button class="logoutBtn btn" type="button" @click="kakaoLogout">로그아웃</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

const getKakaoToken = async (code) => {
  try {
    const data = {
      grant_type: "authorization_code",
      client_id: "dbe0b0cf6f38d1793f0cd63f8b62c875", // REST API 키
      redirect_uri: `${process.env.VUE_APP_front_url}/`,
      code: code,
    };

    const queryString = Object.keys(data).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k])).join("&");
    const result = await axios.post("https://kauth.kakao.com/oauth/token", queryString,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getKakaoUserInfo = async () => {
  try {
    const data = await window.Kakao.API.request({url: "/v2/user/me"})
    return data;
  } catch (err) {
    console.error(err);  
  }
};

export default {
  data() {
    return {
      user: {}, // TODO store로 이관 필요
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    // code가 있는 경우 토큰 발급 요청
    if (urlParams.has("code")) {
      const code = urlParams.get("code");
      this.setKakaoToken(code);
    }
  },
  methods: {
    // 1. 인가 코드 얻기
    kakaoLogin() {
      window.Kakao.Auth.authorize({
        redirectUri: `${process.env.VUE_APP_front_url}/`,
      });
    },

    // 2. 토큰 조회
    async setKakaoToken(code) {
      const { data } = await getKakaoToken(code);
      if (data.error) {
        console.log(data.error);
        return;
      }
      window.Kakao.Auth.setAccessToken(data.access_token);
      await this.setUserInfo();
    },

    // 3. 사용자 정보 조회
    async setUserInfo() {
      const res = await getKakaoUserInfo();
      // console.log("카카오 계정 정보", res);
      const userInfo = {
        id: res.id,
        name: res.kakao_account.profile.nickname,
        profile_image: res.kakao_account.profile.profile_image_url,
      };
      this.user = userInfo;
      // 상위 컴포넌트에 user 전달
      this.$emit('loginSuccess', this.user);
      // 서버에 유저 정보 전달
      try {
        await axios.post(`${process.env.VUE_APP_server_url}/userInfo`, userInfo)
      } catch (err) {
        console.error(err);
      }
    },

    // 로그아웃
    kakaoLogout() {
      this.user = {};
      window.Kakao.Auth.logout()
        .then(function (response) {
          // console.log(window.Kakao.Auth.getAccessToken()); // null
          console.log(response);
          window.location.replace("/");
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.btn {
  cursor: pointer;
}
.inLoginBox {
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 50px;
}
.logoutBtn {
  width: 90px;
  height: 30px;
  border: none;
  border-radius: 12px;
  background-color: #FEE500;
  font-weight: bold;
}
</style>