import { createApp } from 'vue'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import Dialog from './components/common/Dialog.vue'

const app = createApp(App)
app.component('Dialog', Dialog)
app.use(router).use(store).mount('#app')
