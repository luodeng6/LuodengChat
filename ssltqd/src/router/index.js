import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/AI',
    name: 'AI',
    component: () => import( '../views/AI.vue')
  },
  {
    path: '/markdown',
    name: 'markdown',
    component: () => import( '../views/markdown1.vue')

  }
]

const router = new VueRouter({
  mode: 'hash', // 用于去掉 URL 中的哈希(#)
  base: process.env.BASE_URL,
  routes
})

export default router
