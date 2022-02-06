import router from '@/router';
import store from '@/store';
import backend from './Backend';
import { BakeryManager } from './BakeryManager';

export interface Product {
  id: string;
  bakeryId: string;
  name: string;
  price: number;
  description: string;
  deliveryTime: number;
  ingredients: { name: string; amount: string }[];
  nutrition: {
    energy: string;
    fat: string;
    saturates: string;
    carbonhydrate: string;
    sugar: string;
    protein: string;
    salt: string;
  };
  images: { name: string; src: string }[];
}

export class ProductManager {
  static storeProducts(products: Product[]): void {
    const ids = products.map((x) => x.id);
    const unchanged = this.products.filter((x) => !ids.includes(x.id));
    store.commit('products', [...unchanged, ...products]);
  }

  static removeProduct(id: string): void {
    store.commit(
      'products',
      this.products.filter((x) => x.id !== id)
    );
  }

  static get products(): Product[] {
    return store.getters.products;
  }

  static async loadProducts(): Promise<void> {
    const ids = BakeryManager.bakeries.map((x) => x.id);
    return new Promise((resolve, reject) => {
      backend
        .post('product/search', { bakeryIds: ids })
        .then(({ data }) => {
          this.storeProducts(data);
          resolve();
        })
        .catch(reject);
    });
  }

  static getProduct(id: string): Product {
    return this.products.filter((x) => x.id === id)[0];
  }

  static getProducts(
    bakeryId: string = router.currentRoute.params.id
  ): Product[] {
    return this.products
      .filter((x) => x.bakeryId === bakeryId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
