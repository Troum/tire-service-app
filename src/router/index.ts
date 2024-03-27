/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import {useAppStore} from "../stores/app";
import {useGuardedRoutes} from "../config/useGuardedRoutes";

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

router.beforeEach(async (to: any, from: any, next: any): Promise<void> => {
  const appStore = useAppStore();
  if (useGuardedRoutes.some(v => v.test(to.path)) && !appStore.authToken) {
    return next({path: "/login"});
  }
  return next();
})

export default router
