import _Vue, { PluginFunction } from 'vue';
import biBakery from './biBakery.vue';
import biCalendar from './biCalendar.vue';
import biCart from './biCart.vue';
import biChevronLeft from './biChevronLeft.vue';
import biChevronRight from './biChevronRight.vue';
import biEuro from './biEuro.vue';
import biFilter from './biFilter.vue';
import biPlus from './biPlus.vue';
import biSettings from './biSettings.vue';

export const BHIcons: PluginFunction<unknown> = function registerIcons(
  Vue: typeof _Vue
): void {
  Vue.component('biPlus', biPlus);
  Vue.component('biBakery', biBakery);
  Vue.component('biCalendar', biCalendar);
  Vue.component('biSettings', biSettings);
  Vue.component('biCart', biCart);
  Vue.component('biChevronLeft', biChevronLeft);
  Vue.component('biChevronRight', biChevronRight);
  Vue.component('biEuro', biEuro);
  Vue.component('biFilter', biFilter);
};
