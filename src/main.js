import Vue from 'vue';
import App from './App.vue';
import router from '@/router';
import '@/assets/tailwind.css';
import constants from '@/utils/constants';

Vue.config.productionTip = false;
Vue.prototype.$const = constants;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
