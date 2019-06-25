/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import Vue from 'vue'
import Router from 'vue-router'
import irohaUtil from '@util/iroha'

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
          component: lazyComponent('Dashboard/DashboardPage')
        },
        {
          path: 'wallets',
          name: 'wallets',
          component: lazyComponent('Wallets/WalletsPage'),
          children: [
            {
              path: ':walletId',
              component: lazyComponent('Wallets/Wallet')
            }
          ]
        },
        {
          path: 'settlements',
          name: 'settlements-page',
          component: lazyComponent('Settlements/SettlementsPage'),
          children: [
            {
              path: 'history',
              name: 'settlements-history',
              component: lazyComponent('Settlements/SettlementsHistory')
            },
            {
              path: 'incoming',
              name: 'settlements-incoming',
              component: lazyComponent('Settlements/SettlementsIncoming')
            },
            {
              path: 'outgoing',
              name: 'settlements-outgoing',
              component: lazyComponent('Settlements/SettlementsOutgoing')
            }
          ]
        },
        {
          path: 'reports',
          name: 'reports',
          component: lazyComponent('Reports/ReportsPage')
        },
        {
          path: 'billing-reports',
          name: 'billing-reports',
          component: lazyComponent('Reports/BillingReportsPage')
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: lazyComponent('Transactions/TransactionPage')
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
