import Vue from 'vue';
import VueApexCharts from 'vue-apexcharts';
import Vuement from 'vuement';
import App from './App.vue';
import { BHIcons } from './components/icons';
import './registerServiceWorker';
import router from './router';
import store from './store';
import { Authenticator } from './utils/Authenticator';
import {
  getDayName,
  getStatus,
  getTotal,
  orderDescription,
  orderItems,
  round,
  transformAddress,
  transformDue,
  transformPrice,
} from './utils/Functions';
import { SettingsUtils } from './utils/SettingsUtils';

Vue.config.productionTip = false;

Vue.use(Vuement, { colors: { primary: '#f0973f' } });
Vue.use(BHIcons);
Vue.use(VueApexCharts);

Authenticator.test();
SettingsUtils.loadTheme();
SettingsUtils.loadPrimary();

Vue.prototype.$getTotal = getTotal;
Vue.prototype.$getDayName = getDayName;
Vue.prototype.$price = transformPrice;
Vue.prototype.$address = transformAddress;
Vue.prototype.$due = transformDue;
Vue.prototype.$status = getStatus;
Vue.prototype.$round = round;
Vue.prototype.$description = orderDescription;
Vue.prototype.$items = orderItems;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
