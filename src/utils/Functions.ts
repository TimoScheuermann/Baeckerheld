import Vue from 'vue';
import { VMNotificationObject } from 'vuement';
import { Bakery } from './BakeryManager';
import { Order, OrderProduct } from './OrderManager';

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

export function transformPrice(price: number | Order): string {
  if (typeof price === 'object') {
    price = price.products.map((x) => x.price).reduce((a, b) => a + b, 0);
  }

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

export function transformDue(due: number): string {
  return Intl.DateTimeFormat('de-de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(due);
}

export function getStatus(order: Order): number {
  const { products } = order;
  const _ = (products: OrderProduct[]): number => {
    return products.map((x) => x.amount).reduce((a, b) => a + b, 0);
  };
  return round(_(products.filter((x) => x.done)) / _(products));
}

export function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function orderDescription(order: Order): string {
  const items = orderItems(order);
  const suffix = items === 1 ? 'Produkt' : 'Produkte';
  return `(${round(getStatus(order) * 100)}%) ${items} ${suffix}`;
}

export function orderItems(products: Order | OrderProduct[]): number {
  if (!Array.isArray(products)) products = products.products;
  return products.map((x) => x.amount).reduce((a, b) => a + b, 0);
}
