/* eslint-disable */

import router from '@/router';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Order, OrderManager } from '@/utils/OrderManager';
import { Product, ProductManager } from '@/utils/ProductManager';
import { User } from '@/utils/UserManager';
import Vue from 'vue';
import { noop } from 'vue-class-component/lib/util';
import { RawLocation } from 'vue-router';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    savedRoute: null,
    data_loaded: '',
    title: 'Bäckerheld',
    bakeries: [],
    orders: [],
    products: [],
    bakery: null,
    product: null,
    dialog_create_bakery: false,
    dialog_select_bakery: false,
    dialog_delete_bakery: false,
    dialog_edit_bakery_name: false,
    dialog_edit_bakery_address: false,
    dialog_edit_bakery_opening_hours: false,
    dialog_register_product: false,
    dialog_import_product: false,
    dialog_edit_product: false,
  },
  getters: {
    user: (state: any): User | null => {
      return state.user;
    },
    name: (state: any): string => {
      const user: User | null = state.user;
      if (!user) return '';
      return [user.firstName, user.lastName].filter((x) => !!x).join(' ');
    },
    title: (state: any): string => {
      return state.title;
    },
    bakeries: (state: any): Bakery[] => {
      return state.bakeries;
    },
    orders: (state: any): Order[] => {
      return state.orders;
    },
    products: (state: any): Product[] => {
      return state.products;
    },
  },
  mutations: {
    savedRoute(state: any, route: RawLocation): void {
      state.savedRoute = route;
    },
    signOut(state: any) {
      state.user = null;
      router.push({ name: 'login' }).catch(noop);
    },
    async signIn(state: any, user: any) {
      state.user = user;
      router.push(state.savedRoute || { name: 'home' }).catch(noop);

      await BakeryManager.loadBakeries();

      await Promise.all([
        OrderManager.loadOrders(),
        ProductManager.loadProducts(),
      ]);
      state.data_loaded = '1';
    },
    user(state: any, user: User) {
      if (user && typeof user === 'object') {
        state.user = user;
      }
    },
    title(state: any, title: string) {
      state.title = title;
    },

    bakeries(state: any, bakeries: Bakery[]) {
      state.bakeries = bakeries;
    },
    orders(state: any, orders: Order[]) {
      state.orders = orders;
    },
    products(state: any, products: Product[]) {
      state.products = products;
    },
    dialog_create_bakery(state: any, open: boolean) {
      state.dialog_create_bakery = open;
    },
    dialog_select_bakery(state: any, open: boolean) {
      state.dialog_select_bakery = open;
    },
    dialog_delete_bakery(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_delete_bakery = open;
    },
    dialog_edit_bakery_address(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_edit_bakery_address = !!open;
    },
    dialog_edit_bakery_name(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_edit_bakery_name = !!open;
    },
    dialog_edit_bakery_opening_hours(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_edit_bakery_opening_hours = !!open;
    },
    dialog_register_product(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_register_product = open;
    },
    dialog_import_product(state: any, open: boolean | Bakery) {
      state.bakery = typeof open === 'object' ? open : null;
      state.dialog_import_product = open;
    },
    dialog_edit_product(state: any, open: boolean) {
      state.dialog_edit_product = open;
    },
  },
});
