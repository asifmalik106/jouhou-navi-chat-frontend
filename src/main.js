import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/base.css';
import './assets/styles/shadstrap.css';
import './assets/styles/custom.css';
import router from './router';
import i18n from './i18n';

const app = createApp(App);

app.use(router);
app.use(i18n);

app.mount('#app');
