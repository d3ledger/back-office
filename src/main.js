import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faWallet, faSignOutAlt, faFileInvoice, faExchangeAlt, faAngleDoubleDown, faAngleDoubleUp, faArrowRight, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import 'cryptocoins-icons/webfont/cryptocoins.css'

library.add(faChartLine, faWallet, faSignOutAlt, faFileInvoice, faExchangeAlt, faAngleDoubleDown, faAngleDoubleUp, faArrowRight, faDownload, faUpload)
Vue.component('fa-icon', FontAwesomeIcon)

// TODO: import only necessary components
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
