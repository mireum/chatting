<template>
  <div>
    <div id="naverIdLogin"></div>
    <button type="button" @click="logout">로그아웃</button>
  </div>
</template>

<script>
import axios from 'axios';

export default{
  data() {
    return {
      naverLogin: null
    };
  },
  mounted() {
    this.naverLogin = new window.naver.LoginWithNaverId({
      clientId: "dV_7BO34dzC4GTolRjVY",
      callbackUrl: "http://localhost:8080/",
      isPopup: false,
      loginButton: {
        color: "green", type: 3, height: 60},  // 로그인 버튼의 타입을 지정 
    });

    // 설정 정보를 초기화하고 연동을 준비
    this.naverLogin.init();

    this.naverLogin.getLoginStatus(async (status) =>{
      if(status){
        // console.log(this.naverLogin.user);

        const userInfo = {
          id: this.naverLogin.user.id,
          name: this.naverLogin.user.nickname,
          profile_image: this.naverLogin.user.profile_image
        };
        // 서버에 유저 정보 전달
        try {
          const result = await axios.post('http://localhost:8000/userInfo', userInfo)
          console.log(result);
        } catch (err) {
          console.error(err);
        }
        return;
      }
    })
  },
  methods: {
    logout() {
      const accessToken = this.naverLogin.accessToken.accessToken;
      const url = `/oauth2.0/token?grant_type=delete&client_id=zFcLWPMTcDQTNTB6iIOy&client_secret=bUW7FZMpS9&access_token=${accessToken}&service_provider=NAVER`;
      axios.get(url).then((res) => {
        console.log(res.data)
      });
      // com.naver.nid.access_token
      // com.naver.nid.oauth.state_token
    }
  }

}
</script>