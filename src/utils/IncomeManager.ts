import store from '@/store';
import backend from './Backend';
import { BakeryManager } from './BakeryManager';

export interface Income {
  month: string;
  income: number;
}

export class IncomeManager {
  static get incomes(): Record<string, Income[]> {
    return store.getters.income;
  }

  static get incomeMonth(): {
    month: string;
    bakeries: Record<string, number>;
  }[] {
    return Object.entries(
      Object.entries(this.incomes)
        .map(([bakeryd, incomes]) => {
          return incomes.map((x) => {
            return { bakeryId: bakeryd, month: x.month, income: x.income };
          });
        })
        .flat()
        .reduce((acc, x) => {
          const { bakeryId, income, month } = x;
          if (!acc[month]) acc[month] = {};
          acc[month][bakeryId] = income;
          return acc;
        }, {} as Record<string, Record<string, number>>)
    )
      .map(([month, bakeries]) => {
        return { month: month, bakeries: bakeries };
      })
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  static async loadIncome(): Promise<void> {
    await Promise.all(
      BakeryManager.bakeries.map((b) => {
        return new Promise<void>((resolve, reject) => {
          backend
            .get('order/bakery/' + b.id + '/income')
            .then(({ data }) => {
              store.commit('income', { bakeryId: b.id, income: [...data] });
              resolve();
            })
            .catch(reject);
        });
      })
    );
  }
}
