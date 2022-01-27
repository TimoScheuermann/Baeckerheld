import store from '@/store';
import { MetaInjector } from '@/utils/MetaInjector';
import Vue from 'vue';
import VueRouter from 'vue-router';
import EmptyRouter from './EmptyRouter.vue';

Vue.use(VueRouter);
export const suffix = ' | Bäckerheld';

const router = new VueRouter({
  scrollBehavior(to, _, savedPosition) {
    if (to.hash) return { selector: to.hash, offset: { x: 0, y: 600 } };
    return savedPosition || { x: 0, y: 0 };
  },

  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'Übersicht' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: 'Anmeldung' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: 'Einstellungen' },
    },
    {
      path: '/orders',
      component: EmptyRouter,
      children: [
        {
          path: '',
          name: 'orders',
          component: () => import('@/views/Orders.vue'),
          meta: { title: 'Bestellungen' },
        },
      ],
    },

    {
      path: '/bakeries',
      component: EmptyRouter,
      children: [
        {
          path: '',
          name: 'bakeries',
          component: () => import('@/views/Bakeries.vue'),
          meta: { title: 'Bäckereien' },
        },
        {
          path: ':id',
          name: 'bakery-details',
          component: () => import('@/views/BakeryDetails.vue'),
          meta: { title: 'Bäckerei' },
        },
      ],
    },
  ],
});

router.beforeEach((to, _, next) => {
  if (to.name !== 'login' && !store.getters.user) {
    store.commit('savedRoute', to);
    next({ name: 'login' });
  } else {
    if (to.meta && to.meta.title) MetaInjector.setPageTitle(to.meta.title);
    next();
  }
});

export default router;
