import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
// import fr from 'vuetify/src/locale/fr'
import fr from 'vuetify/es5/locale/fr'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'
import nprogress from 'nprogress'
import VuexI18n from 'vuex-i18n'
import VueI18nDirectives from 'vue-i18n-directives'
import VueCookies from 'vue-cookies'
import moment from 'moment'
import VueHighlightJS from 'vue-highlight.js'
import 'highlight.js/styles/dracula.css'

// app, router
import App from './App'
import router from './router'

// services
import ApiService from './services/api'
import LoggerService from './services/logger'
import I18nService from './services/i18n'

// components
import Card from './components/ActuatorCard'
import Raw from './components/Raw'
import ButtonFilter from './components/ButtonFilter'

Vue.use(Vuetify, {
  lang: {
    locales: {fr},
    current: 'en'
  }
})
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.use(VueCookies)
Vue.use(VueHighlightJS)
Vue.use(LoggerService)
Vue.use(I18nService)
Vue.use(ApiService)

Vue.component('actuator-card', Card)
Vue.component('raw', Raw)
Vue.component('button-filter', ButtonFilter)

Vue.filter('date', function (value, formatParam) {
  let format = formatParam || 'MM/DD/YYYY HH:mm:ss'
  if (value) {
    return moment(String(value)).format(format)
  }
})

const store = new Vuex.Store()
Vue.use(VuexI18n.plugin, store, {
  onTranslationNotFound (locale, key) {
    Vue.$log.warn(`i18n :: Key '${key}' not found for locale '${locale}'`)
  }
})
Vue.use(VueI18nDirectives)

let requestsCounter = 0

nprogress.configure({showSpinner: false})

axios.interceptors.request.use(function (config) {
  requestsCounter++
  nprogress.start()
  return config
})

axios.interceptors.response.use(function (response) {
  if ((--requestsCounter) === 0) {
    nprogress.done()
  }
  return response
}, function (error) {
  if ((--requestsCounter) === 0) {
    nprogress.done()
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
