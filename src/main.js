import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import DataTable from 'laravel-vue-datatable';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store'

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(DataTable);

// const vuetifyOpts = {
//     rtl: false,
//     theme: {
//         dark: true,
//         themes: {
//             dark: {
//                 primary: '#000000',
//                 accent: '#212121',
//                 secondary: '#424242',
//                 success: '#616161',
//                 info: '#757575',
//                 warning: '#BDBDBD',
//                 error: '#E0E0E0'
//             },
//             light: {
//                 primary: '#000000',
//                 accent: '#212121',
//                 secondary: '#424242',
//                 success: '#616161',
//                 info: '#757575',
//                 warning: '#BDBDBD',
//                 error: '#E0E0E0'
//             }
//         }
//     }
// }


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

