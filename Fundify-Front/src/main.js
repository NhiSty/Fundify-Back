import './assets/main.css'
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//Toastification
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
const vuetify = createVuetify({
    components,
    directives,
});
const notificationOptions = {
    position: "top-left",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    closeButton: "button",
    icon: true,
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true
}

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast, notificationOptions)

app.mount('#app')
