import Vue from 'vue';
import { VMNotificationObject } from 'vuement';
import { Order } from './OrderManager';

export function copyToClipboard(text: string): void {
  const dummy = document.createElement('textarea');
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

export function sendNotification(notification: VMNotificationObject): void {
  Vue.prototype.$vm.sendNotification(notification);
}

export function getTotal(orders: Order[] = []): number {
  const total = orders
    .map((x) =>
      x.products.map((x) => x.price).reduce((prev, curr) => prev + curr, 0)
    )
    .reduce((prev, curr) => prev + curr, 0);

  return Math.round(total * 100) / 100;
}

export function getDayName(day: string): string {
  const days: Record<string, string> = {
    monday: 'Montag',
    tuesday: 'Dienstag',
    wednesday: 'Mittwoch',
    thursday: 'Donnerstag',
    friday: 'Freitag',
    saturday: 'Samstag',
    sunday: 'Sonntag',
  };
  return days[day] || 'unknown.';
}
