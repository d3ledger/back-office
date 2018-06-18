import Vue from 'vue'
import Router from 'vue-router'
import irohaUtil from 'util/iroha-util'

import Home from '@/components/Home'
import DashboardPage from '@/components/dashboard/DashboardPage'
import WalletsPage from '@/components/Wallets/WalletsPage'
import WalletPage from '@/components/Wallets/WalletPage'
import SettlementsPage from '@/components/Settlements/SettlementsPage'
import SettlementsWaiting from '@/components/Settlements/SettlementsWaiting'
import SettlementsHistory from '@/components/Settlements/SettlementsHistory'
import SettingsPage from '@/components/Settings/SettingsPage'
import Login from '@/components/Login'
import Signup from '@/components/Signup'

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
              component: WalletPage
            }
          ]
        },
        {
          path: 'settlements',
          name: 'settlements-page',
          component: SettlementsPage,
          children: [
            {
              path: '',
              name: 'settlements-waiting',
              component: SettlementsWaiting
            },
            {
              path: 'history',
              name: 'settlements-history',
              component: SettlementsHistory
            }
          ]
        },
        {
          path: 'settings',
          name: 'settings-page',
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
