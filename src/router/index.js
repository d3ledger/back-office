import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard/Dashboard'
import SettingsPage from '@/components/SettingsPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'settings',
          name: 'settings-page',
          component: SettingsPage
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
