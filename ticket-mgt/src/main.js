import './assets/main.css'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import Toast from 'vue-toastification'
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(Toast, {
  timeout: 3000,
  position: 'top-right',
})
app.mount('#app')
