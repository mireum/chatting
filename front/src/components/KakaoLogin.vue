<template>
  <div>
    <a v-if="user.name == undefined" @click="kakaoLogin">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
      />
    </a>
    <div v-else>
      <p>nickname: {{ user.name }}</p>
      <!-- <p>email: {{ user.email }}</p> -->
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
      redirect_uri: "http://localhost:8080/kakaologin",
      code: code,
    };

    const queryString = Object.keys(data)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
      .join("&");
    //console.log(queryString);

    const result = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      queryString,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getKakaoUserInfo = async () => {
  let data = "";
  await window.Kakao.API.request({
    url: "/v2/user/me",
  })
    .then(function (response) {
      console.log(response);
      data = response;
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log("카카오 계정 정보", data);
  return data;
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
      console.log("code: ", code);
      this.setKakaoToken(code);
    }
  },
  methods: {
    // 1. 인가 코드 얻기
    // https://developers.kakao.com/docs/latest/ko/kakaologin/js#login
    kakaoLogin() {
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:8080/kakaologin",
      });
    },

    // 2. 토큰 조회
    // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
    async setKakaoToken(code) {
      const { data } = await getKakaoToken(code);
      if (data.error) {
        console.log(data.error);
        return;
      }
      console.log(data);
      window.Kakao.Auth.setAccessToken(data.access_token);
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