import { createRouter, createWebHistory } from 'vue-router';
import ChatTing from '@/components/ChatTing.vue';
// import App from '../App.vue';

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: App,
  // },
  {
    path: '/:roomId',
    name: 'roomId',
    component: ChatTing,
  },
];
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;