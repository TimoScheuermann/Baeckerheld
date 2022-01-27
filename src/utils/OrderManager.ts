import store from '@/store';
import backend from './Backend';
import { BakeryManager } from './BakeryManager';

export interface Order {
  id: string;
  status: string;
  due: number;
  products: OrderProduct[];
}

export interface OrderProduct {
  orderIndex: number;
  productId: string;
  bakeryId: string;
  amount: number;
  price: number;
  done: boolean;
}

export class OrderManager {
  private static storeOrders(orders: Order[]): void {
    const ids = orders.map((x) => x.id);
    const unchanged = this.orders.filter((x) => !ids.includes(x.id));
    store.commit(
      'orders',
      [...unchanged, ...orders].sort((a, b) => a.due - b.due)
    );
  }

  static get orders(): Order[] {
    return store.getters.orders;
  }

  static async loadOrders(): Promise<void> {
    await Promise.all(
      BakeryManager.bakeries.map((b) => {
        return new Promise<void>((resolve, reject) => {
          backend
            .get('order/bakery/' + b.id)
            .then(({ data }) => {
              this.storeOrders(data);
              resolve();
            })
            .catch(reject);
        });
      })
    );
  }
}
