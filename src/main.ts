import Vue from 'vue';
import Vuement from 'vuement';
import App from './App.vue';
import { BHIcons } from './components/icons';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Authenticator } from './utils/Authenticator';
import { getDayName, getTotal } from './utils/Functions';

Vue.config.productionTip = false;

Vue.use(Vuement, { colors: { primary: '#f0973f' } });
Vue.use(BHIcons);

Authenticator.test();

Vue.prototype.$getTotal = getTotal;
Vue.prototype.$getDayName = getDayName;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
