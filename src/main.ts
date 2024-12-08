/*
 * @Author: pangwei pw374644043@gmail.com
 * @Date: 2023-02-08 09:52:58
 * @LastEditors: pangwei pw374644043@gmail.com
 * @LastEditTime: 2023-02-13 09:25:13
 */
import { createApp } from 'vue'
import 'element-plus/theme-chalk/el-message.css'
import './style.css'
import App from './App.vue'
import router from './route'

createApp(App).use(router).mount('#app')
