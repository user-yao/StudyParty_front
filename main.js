import 'core-js/stable'; // 引入所有稳定的 polyfill
import 'regenerator-runtime/runtime'; // 处理 async/await 等 generator 函数
import App from './App'
import store from './store/index.js'
import uviewPlus from 'uview-plus'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()

// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(uviewPlus)
  return {
    app
  }
}
// #endif
