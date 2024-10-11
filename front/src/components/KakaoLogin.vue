<template>
  <div>
    <a v-if="user.name == undefined" @click="kakaoLogin">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
      />
    </a>
    <div v-else>
      <p>nickname: {{ user.name }} 님</p>
      <button type="button" @click="kakaoLogout">카카오 로그아웃</button>
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
      redirect_uri: "http://localhost:8080/",
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
        redirectUri: "http://localhost:8080/",
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
      console.log("카카오 계정 정보", res);
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
        const result = await axios.post('http://localhost:8000/userInfo', userInfo)
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    },

    // 로그아웃
    kakaoLogout() {
      this.user = {};
      window.Kakao.Auth.logout()
        .then(function (response) {
          console.log(window.Kakao.Auth.getAccessToken()); // null
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>