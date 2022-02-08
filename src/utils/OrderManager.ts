import store from '@/store';
import backend from './Backend';
import { BakeryManager } from './BakeryManager';
import { sendNotification } from './Functions';

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

  static getOrder(id: string): Order {
    return this.orders.filter((x) => x.id === id)[0];
  }

  private static updateing: string[] = [];
  private static mounted = Date.now() + 1000 * 2;

  static updateIndex(
    orderId: string,
    bakeryId: string,
    orderIndex: number
  ): void {
    if (this.updateing.includes(orderId)) return;
    if (this.mounted >= Date.now()) return;

    this.updateing.push(orderId);

    backend
      .patch(`order/bakery/${bakeryId}/${orderId}/${orderIndex}`)
      .then(({ data }) => {
        const order = this.getOrder(orderId);
        if (!order) return;
        const product = order.products[orderIndex];
        if (!product || product.bakeryId !== bakeryId) return;
        product.done = !!data;

        this.storeOrders([{ ...order }]);
      })
      .catch((err) => {
        sendNotification({
          title: 'Es ist ein Fehler aufgetreten',
          text: err.message,
        });
      })
      .finally(() => {
        this.updateing = this.updateing.filter((x) => x !== orderId);
      });
  }
}
