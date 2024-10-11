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
      isPopup: false, // 팝업을 통한 연동처리 여부
      loginButton: {
        color: "green", type: 3, height: 60},  // 로그인 버튼의 타입을 지정 
    });

    // 설정 정보를 초기화하고 연동을 준비
    this.naverLogin.init();

    this.naverLogin.getLoginStatus((status) =>{
      if(status){
        console.log('status', status);
        console.log(this.naverLogin.user);
        // this.naverLogin.reprompt();
        return;
      }else{
        console.log("callback 처리에 실패했습니다.")
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
    }
  }

}
</script>