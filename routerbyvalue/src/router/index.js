import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import UsersParent from '@/components/UsersParent'
import Second from '@/components/Second'
import Three from '@/components/Three'
import Four from '@/components/Four'
import Five from '@/components/Five'
import optimize from '@/components/optimize'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/UsersParent',
      name: 'UsersParent',
      component: UsersParent
    },
    {
      path: '/Second',
      name: 'Second',
      component: Second
    },
    {
      path: '/Three',
      name: 'Three',
      component: Three
    },
    {
      path: '/Four',
      name: 'Four',
      component: Four
    },
    {
      path: '/Five',
      name: 'Five',
      component: Five
    },
    {
      path: '/optimize',
      name: 'optimize',
      component: optimize
    },
  ]
})
