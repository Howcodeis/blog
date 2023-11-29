/*
 * @Author: Matbin
 * @Date: 2023-11-21 13:51:04
 * @Description: 入口配置
 */


import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/index.css'
import './assets/iconfont.css'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
