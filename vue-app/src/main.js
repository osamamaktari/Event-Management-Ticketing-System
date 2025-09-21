// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


import { createApp } from 'vue';
import App from './App.vue';
import router from '../src/router'; 

import './assets/main.css'
const options = {
  position: "top-right",
  timeout: 5000, // 5 ثواني
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 10,
  newestOnTop: true
};



const app = createApp(App);
app.use(Toast, options);
app.use(router); 
app.mount('#app');


