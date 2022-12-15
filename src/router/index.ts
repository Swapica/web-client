import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.dashboard },
  },
  {
    path: '/dashboard',
    name: ROUTE_NAMES.dashboard,
    component: () => import('@/pages/UiKitPage.vue'),
  },
  {
    path: '/my-orders',
    name: ROUTE_NAMES.myOrders,
    component: () => import('@/pages/MyOrdersPage.vue'),
  },
  {
    path: '/claim',
    name: ROUTE_NAMES.claim,
    component: () => import('@/pages/UiKitPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
