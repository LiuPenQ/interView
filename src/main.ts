import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import Dialog from './components/Dialog.vue'

const app = createApp(App)
app.component('Dialog', Dialog)
app.use(router).mount('#app')
