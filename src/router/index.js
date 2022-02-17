import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: (resolve) => require(["@/components/Login"], resolve),
  },
  {
    path: "/home",
    name: "Home",
    // component: (resolve) => require(["@/components/Login"], resolve),
    component: () => import("@/components/Home"),
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: () => import("@/components/Welcome") },
      { path: "/users", component: () => import("@/components/User") },
      { path: "/roles", component: () => import("@/components/Roles") },
      { path: "/rights", component: () => import("@/components/Rights") },
      { path: "/goods", component: () => import("@/components/Goods") },
      { path: "/params", component: () => import("@/components/Params") },
      {
        path: "/categories",
        component: () => import("@/components/Categories"),
      },
      { path: "/orders", component: () => import("@/components/Orders") },
    ],
  },
];
const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(sessionStorage.getItem("userName"));
  // 如果访问登录页放行
  if (to.path === "/login") {
    return next();
  }
  // 如果未登录，则跳转到登录页
  if (!userInfo) {
    return next("/login");
  }
  //已登录放行
  next();
});
export default router;
