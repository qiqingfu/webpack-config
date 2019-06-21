import 'babel-polyfill'
import App from './App'
import Vue from 'vue'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css' 

Vue.use(Vuetify)

new Vue({
    render: h => h(App)
}).$mount('#root')
