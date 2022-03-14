import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import numeral from 'numeral'
import numFormat from 'vue-filter-number-format'
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue2TouchEvents from 'vue2-touch-events'
import Toasted from 'vue-toasted'
import VueObserveVisibility from 'vue-observe-visibility'

Vue.use(VueObserveVisibility)
Vue.use(Toasted)
Vue.use(Vue2TouchEvents)
Vue.use(BootstrapVue)
Vue.filter('numFormat', numFormat(numeral))
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
