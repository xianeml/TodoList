import Vue from 'vue';
import VueRouter from 'vue-router';
import TodoIndex from '../views/TodoIndex.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'TodoIndex',
    component: TodoIndex,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
