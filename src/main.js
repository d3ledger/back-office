import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'

import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faWallet } from '@fortawesome/free-solid-svg-icons/faWallet'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons/faFileInvoice'
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt'
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons/faAngleDoubleDown'
import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons/faAngleDoubleUp'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faUpload } from '@fortawesome/free-solid-svg-icons/faUpload'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import 'cryptocoins-icons/webfont/cryptocoins.css'

library.add(faCog, faChartLine, faWallet, faSignOutAlt, faFileInvoice, faExchangeAlt, faAngleDoubleDown, faAngleDoubleUp, faArrowRight, faDownload, faUpload)
Vue.component('fa-icon', FontAwesomeIcon)

// TODO: import only necessary components
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
