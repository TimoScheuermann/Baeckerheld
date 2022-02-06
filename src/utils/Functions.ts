import Vue from 'vue';
import { VMNotificationObject } from 'vuement';
import { Bakery } from './BakeryManager';
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

export function transformPrice(price: number): string {
  const values = `${price}`.split('.');
  if (values.length === 1) values[0] = values[0] + '.00';
  else if (values[1].length === 1) values[1] = values[1] + '0';
  return values.join('.');
}

export function transformAddress(bakery: Bakery): string | null {
  if (!bakery) return null;
  const { street, streetNumber, city, zip } = bakery;
  const _ = (a: [(string | number)?, (string | number)?], j = ' '): string => {
    return a.filter((x) => x !== undefined && `${x}`.length > 0).join(j);
  };
  return _([_([street, streetNumber]), _([zip, city])], ', ');
}
