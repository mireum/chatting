import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.config.globalProperties.axios = axios;
app.mount('#app')

// 카카오 로그인
window.Kakao.init(process.env.VUE_APP_kakao_code);