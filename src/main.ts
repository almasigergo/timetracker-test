import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App)

app.component('VueDatePicker', VueDatePicker)

const options = {}

app.use(Toast, options)

app.use(router)

app.mount('#app')
