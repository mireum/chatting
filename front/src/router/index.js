import { createRouter, createWebHistory } from 'vue-router';
import ChatTing from '@/components/ChatTing.vue';
import { chatView } from '@/chatView';

const routes = [
  {
    path: '/:roomId',
    name: 'roomId',
    component: ChatTing,
    props: true
  },
];
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    // '/'로 이동할 때 chatView를 false로 설정
    chatView.value = false;
  }
  next();
});

export default router;