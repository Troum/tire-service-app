/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */
// @ts-ignore
import { createRouter, createWebHistory } from 'vue-router/auto'
// @ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'
import {useAppStore} from "../stores/app";

const baseURL = process.env.BASE_URL
const routes = [
  {
    path: '/',
    redirect: '/sizes'
  }
];

const router = createRouter({
  history: createWebHistory(baseURL),
  extendRoutes: setupLayouts,
  routes
})

router.beforeEach((to: any, from: any, next: any)=> {
  const appStore = useAppStore();
  if (to.path !== '/login' && !appStore.authToken) {
    return next({path: "/login"});
  }
  if (to.path === '/' && appStore.authToken) {
    return next({path: "/sizes"});
  }
  return next();
})

export default router
