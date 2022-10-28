import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

import Vant from 'vant';
import 'vant/lib/index.css';
//main.js文件代码
//引入字体
import '@/assets/css/font.css';
import './permission' // permission control
// 在入口文件中（main.js），导入组件库
import vueHashCalendar from 'vue-hash-calendar'
// 引入组件CSS样式
import 'vue-hash-calendar/lib/vue-hash-calendar.css'
// 注册组件库
Vue.use(vueHashCalendar)
/**
 * rem适配
 */
 import './utils/rem'
 /**
 * 全局组件
 */
import CmNavBar from './views/components/CmNavBar.vue'
Vue.component('CmNavBar', CmNavBar)
Vue.use(Vant);
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
