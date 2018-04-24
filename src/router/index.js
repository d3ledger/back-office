import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import BalancePage from '@/components/BalancePage'
import SettlementsPage from '@/components/SettlementsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'balance-page',
          component: BalancePage
        },
        {
          path: '/settlements',
          name: 'settlements-page',
          component: SettlementsPage
        }
      ]
    },
    {
      path: '*',
      redirect: '/balance'
    }
  ]
})
