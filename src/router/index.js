import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: (resolve) => require(['@/components/Login'], resolve),
  },
  {
    path: '/home',
    name: 'Home',
    // component: (resolve) => require(["@/components/Login"], resolve),
    component: () => import('@/components/Home'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: () => import('@/components/Welcome') },
      { path: '/users', component: () => import('@/components/user/User') },
      { path: '/roles', component: () => import('@/components/power/Roles') },
      { path: '/rights', component: () => import('@/components/power/Rights') },
      { path: '/goods', component: () => import('@/components/goods/Goods') },
      { path: '/goods/add', component: () => import('@/components/goods/Add') },
      { path: '/params', component: () => import('@/components/goods/Params') },
      {
        path: '/categories',
        component: () => import('@/components/goods/Categories'),
      },
      { path: '/orders', component: () => import('@/components/Orders/Orders') },
    ],
  },
]
const router = new VueRouter({
  mode: 'hash',
  routes,
})

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(sessionStorage.getItem('userName'))
  // 如果访问登录页放行
  if (to.path === '/login') {
    return next()
  }
  // 如果未登录，则跳转到登录页
  if (!userInfo) {
    return next('/login')
  }
  //已登录放行
  next()
})
export default router
