import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vant 组件 - 全量引入确保兼容
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)
app.use(Vant)

app.mount('#app')
