import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import { createPinia } from 'pinia'
import router from './router'
// import router from './router'
// import socket from 'vue3-websocket'

const app = createApp(App)
// app.use(router)
// createApp(App).mount('#app')
app.use(createPinia())
app.use(router)
app.config.globalProperties.axios = axios;
// app.use(socket, 'http://localhost:8000')
app.mount('#app')

// 카카오 로그인
window.Kakao.init('f82ad1f1417a20a26c13e2fa96349374');