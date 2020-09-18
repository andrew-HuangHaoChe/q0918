import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'
import {
  ValidationObserver,
  ValidationProvider
} from 'vee-validate/dist/vee-validate.full'
import { localize } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import App from './App.vue'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'
import dateFilter from './filters/date'
import vueSmoothScroll from 'vue2-smooth-scroll'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.component('Loading', Loading)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
localize('zh_TW', TW)
Vue.filter('currency', currencyFilter)
Vue.filter('date', dateFilter)
Vue.use(vueSmoothScroll)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((response) => {
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})
