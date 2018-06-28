import Vue from 'vue'
import Router from 'vue-router'
import irohaUtil from 'util/iroha-util'

import Home from '@/components/Home'
import DashboardPage from '@/components/dashboard/DashboardPage'
import WalletsPage from '@/components/Wallets/WalletsPage'
import Wallet from '@/components/Wallets/Wallet'
import SettlementsPage from '@/components/Settlements/SettlementsPage'
import SettlementsIncoming from '@/components/Settlements/SettlementsIncoming'
import SettlementsOutgoing from '@/components/Settlements/SettlementsOutgoing'
import SettlementsHistory from '@/components/Settlements/SettlementsHistory'
import TransfersPage from '@/components/Transfers/TransfersPage'
import ReportsPage from '@/components/Reports/ReportsPage'
import SettingsPage from '@/components/Settings/SettingsPage'
import Login from '@/components/Login'
import Signup from '@/components/Signup'

Vue.use(Router)

export const lazyComponent = (name) => () => import(`@/components/${name}.vue`)

const defaultRouter = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: lazyComponent('Home'),
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
          component: lazyComponent('Settlements/SettlementsPage'),
          children: [
            {
              path: '',
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
          path: 'transfers',
          name: 'transfers',
          component: TransfersPage
        },
        {
          path: 'reports',
          name: 'reports',
          component: ReportsPage
        },
        {
          path: 'settings',
          name: 'settings',
          component: lazyComponent('Settings/SettingsPage')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: lazyComponent('Login')
    },
    {
      path: '/signup',
      name: 'signup',
      component: lazyComponent('Signup')
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
