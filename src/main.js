// Imports
import Vue from 'vue'

// Plugins
import router from './plugins/router';
import vuetify from './plugins/vuetify';

// Components
import App from './App.vue'

// Styles
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app')
