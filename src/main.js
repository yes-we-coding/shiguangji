import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { reveal } from './directives/reveal'

createApp(App).use(router).directive('reveal', reveal).mount('#app')
