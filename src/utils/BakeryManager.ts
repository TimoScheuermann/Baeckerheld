import router from '@/router';
import store from '@/store';
import backend from './Backend';

export interface Bakery {
  id: string;
  name: string;
  openingHours?: OpeningHours;
  city?: string;
  street?: string;
  streetNumber?: string;
  zip?: number;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface OpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export class BakeryManager {
  static storeBakeries(bakeries: Bakery[]): void {
    const ids = bakeries.map((x) => x.id);
    const unchanged = this.bakeries.filter((x) => !ids.includes(x.id));
    store.commit('bakeries', [...unchanged, ...bakeries]);
  }

  static removeBakery(id: string): void {
    store.commit(
      'bakeries',
      this.bakeries.filter((x) => x.id !== id)
    );
  }

  static get bakeries(): Bakery[] {
    return store.getters.bakeries;
  }

  static async loadBakeries(): Promise<void> {
    return new Promise((resolve, reject) => {
      backend
        .get('bakery')
        .then(({ data }) => {
          this.storeBakeries(data);
          resolve();
        })
        .catch(reject);
    });
  }

  static getBakery(id: string = router.currentRoute.params.id): Bakery | null {
    return this.bakeries.filter((x) => x.id === id)[0];
  }
}
