import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';
import VueToast from 'vue-toasted';
import VueRouter from 'vue-router';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';
import VueApexCharts from 'vue-apexcharts';
// import * as Sentry from '@sentry/browser';
import IdleVue from 'idle-vue';
import browserCookies from 'browser-cookies';
import App from './App.vue';
import store from './store';
import router from './router';

Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);
// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: 'https://507d31b553f440428333350b394c62cd@sentry.io/1416825',
//     integrations: [
//       new Sentry.Integrations.Vue({
//         Vue,
//         attachProps: true,
//       }),
//     ],
//     sendDefaultPii: true,
//   });
// }

// Vue.use(
//   VueSocketio,
//   io(
//     process.env.NODE_ENV === 'production' ? 'https://fetchrapp.com:3000' : 'http://127.0.0.1:3000',
//     {
//       transports: ['websocket'],
//     },
//   ),
//   { store },
// );
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);

Vue.use(VueRouter);
Vue.use(VeeValidate);
Vue.use(VueToast);
Vue.use(Vuetify, {
  theme: {
    primary: '#344955',
    secondary: '#232534',
    lightened: '#4a6572',
    accent: '#f9aa33',
    complimentary: '#20FC8F',
  },
});
Vue.use(Vuex);

const eventsHub = new Vue();

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 5 * 60 * 1000,
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  onIdle() {
    // Check if user is logged in, then log out
    if (
      store.getters['login/isLoggedIn']
      && browserCookies.get('token')
      && browserCookies.get('user_id')
    ) {
      store.dispatch('login/logout').then(
        (response) => {
          const allCookies = browserCookies.all();
          for (const cookieName in allCookies) {
            browserCookies.erase(cookieName);
          }

          router.push('/home');
        },
        (error) => {
          store.commit('login/logoutFailed');
        },
      );
    }
  },
  onActive() {
    this.messageStr = 'Hello';
  },
  render: h => h(App),
}).$mount('#app');
