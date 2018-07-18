import Vue from 'vue'
import Router from 'vue-router'
import irohaUtil from '@util/iroha-util'

import Home from '@/components/Home'
import DashboardPage from '@/components/Dashboard/DashboardPage'
import WalletsPage from '@/components/Wallets/WalletsPage'
import Wallet from '@/components/Wallets/Wallet'
import SettlementsPage from '@/components/Settlements/SettlementsPage'
import SettlementsIncoming from '@/components/Settlements/SettlementsIncoming'
import SettlementsOutgoing from '@/components/Settlements/SettlementsOutgoing'
import SettlementsHistory from '@/components/Settlements/SettlementsHistory'
import ReportsPage from '@/components/Reports/ReportsPage'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import SettingsPage from '@/components/Settings/SettingsPage'

Vue.use(Router)

const defaultRouter = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardPage
        },
        {
          path: 'wallets',
          name: 'wallets',
          component: WalletsPage,
          children: [
            {
              path: ':walletId',
              component: Wallet
            }
          ]
        },
        {
          path: 'settlements',
          name: 'settlements-page',
          component: SettlementsPage,
          children: [
            {
              path: 'history',
              name: 'settlements-history',
              component: SettlementsHistory
            },
            {
              path: 'incoming',
              name: 'settlements-incoming',
              component: SettlementsIncoming
            },
            {
              path: 'outgoing',
              name: 'settlements-outgoing',
              component: SettlementsOutgoing
            }
          ]
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsPage
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsPage
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

defaultRouter.beforeEach((to, from, next) => {
  if (to.name === 'login' || to.name === 'signup') return next()

  if (irohaUtil.isLoggedIn()) {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default defaultRouter
