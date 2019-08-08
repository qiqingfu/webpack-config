import 'babel-polyfill'
import App from './App'
import Vue from 'vue'
import router from './router'

new Vue({
    router,
    render: h => h(App)
}).$mount('#root')
