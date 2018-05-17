import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'

import locale from 'element-ui/lib/locale/lang/en'

// TODO: import only necessary components
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
