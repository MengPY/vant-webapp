import Vue from 'vue'
import App from './App.vue'
import { router } from './router/index'
import store from './store'
import common from '@/api/constants';
import Vant from 'vant';
import 'vant/lib/index.css';
import '@/styles/theme.less'
//ali图标库
import "@/styles/fonts/iconfont.css"
import "@/styles/fonts/iconfont.js"

import { setStore, getStore, removeStore } from '@/libs/storage'

import '@/libs/directive'
import util from '@/libs/util'
import calculator from '@/libs/calculator'
import components from "@/components/install"

Vue.use(Vant);
Vue.use(components);
Vue.config.productionTip = false
Vue.prototype.$utils = util
Vue.prototype.$Calculator = calculator;
Vue.prototype.$common = common;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.$toast.setDefaultOptions({ duration: 2 * 1000 });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
