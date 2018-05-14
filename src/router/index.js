import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import WalletsPage from '@/components/Wallets/WalletsPage'
import WalletPage from '@/components/WalletPage'
import SettlementsPage from '@/components/Settlements/SettlementsPage'
import SettlementsWaiting from '@/components/Settlements/SettlementsWaiting'
import SettlementsHistory from '@/components/Settlements/SettlementsHistory'
import SettingsPage from '@/components/Settings/SettingsPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'wallets',
          component: WalletsPage
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
      path: '/wallet/:asset',
      component: WalletPage
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
