import Vue from 'vue'
import Router from 'vue-router'
import VularLogin from "./components/VularLogin.vue"
import Dashboard from "./components/pages/dashboard/Dashboard"
import VularModule from "./VularAdmin/VularModule"
import VularPageLoader from "./VularAdmin/VularPageLoader.vue"
//import VularEditPage from "./components/VularEditPage.vue"
import VularMediasPage from "./components/VularMediasPage.vue"
import ThemeSettings from "./components/pages/theme/ThemeSettings.vue"

import VularAdmin from "./VularAdmin"
import VularCustomized from './Customized'
import CustomizedModules from './Customized/Modules'
import CustomizedWelcomePage from './Customized/Modules/WelcomePage'
import CustomizedModuleEditPage from './Customized/Modules/ModuleEditPage'

Vue.use(Router)

Vue.component('VularAdmin', VularAdmin)
Vue.component('VularCustomized',VularCustomized)
Vue.component('CustomizedModules',CustomizedModules)
Vue.component('CustomizedWelcomePage',CustomizedWelcomePage)
Vue.component('CustomizedModuleEditPage',CustomizedModuleEditPage)

Vue.component('VularLogin', VularLogin)
Vue.component('Dashboard', Dashboard)
Vue.component('VularModule', VularModule)
Vue.component('VularPageLoader', VularPageLoader)
//Vue.component('VularEditPage', VularEditPage)
Vue.component('VularMediasPage', VularMediasPage)
Vue.component('ThemeSettings', ThemeSettings)

export default new Router({
  routes: [
    {
      path:'/',
      name:'admin',
      redirect:'/admin/dashboard',
    },
    {
      path: '/customized',
      name:'customized',
      component: VularCustomized,
      redirect:'/customized/modules/welcome',
      children:[
        {
          path: 'modules',
          name: 'customized-modules',
          component: CustomizedModules,
          redirect:'/customized/modules/welcome',
          children: [
            {
              path: 'welcome',
              name: 'customized-modules-welcome',
              component: CustomizedWelcomePage,
            },
            {
              path: 'module/:moduleId',
              name: 'customized-module',
              component: CustomizedModuleEditPage,
            },
          ]
        },
        {
          path: 'menus',
          name: 'customized-menus',
        },
        {
          path: 'themes',
          name: 'customized-themes',
        },
        {
          path: 'settings',
          name: 'customized-settings',
        },
      ],
    },
    {
      path:'/admin',
      component: VularAdmin,
      children:[
        {
          path: 'module/:moduleId',
          name: 'module',
          component: VularModule,
          redirect:'module/:moduleId/page/:pageId/data/:data?',
          children: [
            {
              path: 'page/:pageId/data/:data?',
              name: 'page',
              component: VularPageLoader,
            },
          ]
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: 'medias',
          name: 'medias',
          component: VularMediasPage
        },
        {
          path: 'login',
          name: 'login',
          component: VularLogin
        },
        {
          path: 'theme-settings',
          name: 'theme-settings',
          component: ThemeSettings
        },
      ]
    },

  ]
})
