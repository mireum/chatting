<template>
  <div>
    <div v-if="user==null" id="naverIdLogin"></div>
    <div v-else class="inLoginBox">
      <p><strong>{{ user.name }}</strong> 님</p>
      <button class="logoutBox btn" type="button" @click="logout">
        <img src="../assets/naver_logout.png" />
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default{
  data() {
    return {
      naverLogin: null,
      user: null
    };
  },
  mounted() {
    this.naverLogin = new window.naver.LoginWithNaverId({
      clientId: "dV_7BO34dzC4GTolRjVY",
      callbackUrl: "http://localhost:8080/",
      isPopup: false,
      loginButton: {
        color: "green", type: 2, height: 30},  // 로그인 버튼의 타입을 지정 
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
        this.user = userInfo;
        this.$emit('loginSuccess', this.user);
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
      window.localStorage.removeItem('com.naver.nid.access_token');
      window.localStorage.removeItem('com.naver.nid.oauth.state_token');
      window.location.replace("/");
    }
  }

}
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
.logoutBox {
  height: 30px;
  border: none;
  background-color: #fff;
}
.logoutBox img {
  height: 30px;
}
</style>