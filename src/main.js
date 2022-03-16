import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/img/css/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
Vue.prototype.$http = axios
axios.defaults.baseURL = ' http://www.tangxiaoyang.vip:8888/api/v2/'
// axios的请求拦截器，添加token认证
axios.interceptors.request.use((config) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userName'))
  config.headers.Authorization = userInfo ? userInfo.token : ''
  return config
})

Vue.config.productionTip = false

new Vue({
  mode: 'hash',
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
