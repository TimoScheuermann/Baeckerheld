<template>
  <div class="view-orders">
    <vm-flow>
      <vm-title subtitle="Übersicht" title="Bestellungen" />
      <vm-select :multiple="true" placeholder="Bäckerei" @selection="selection">
        <vm-select-item
          v-for="b in uniqueBakeries"
          :key="b.id"
          :vmId="b.id"
          :title="b.name"
          :selected="true"
        />
      </vm-select>
    </vm-flow>
    <br />

    <vm-grid width="130" gap="20">
      <section stats>
        <bi-bakery icon />
        <div>{{ selectedBakeries.length }}</div>
        <span>Bäckereien</span>
      </section>
      <section stats>
        <bi-calendar icon />
        <div>{{ orders.length }}</div>
        <span>Bestellungen</span>
      </section>
      <section stats>
        <bi-cart icon />
        <div>{{ products.length }}</div>
        <span>Produkte</span>
      </section>
      <section stats>
        <bi-euro icon />
        <div>{{ $getTotal(orders) }}€</div>
        <span>Bestellwert</span>
      </section>
    </vm-grid>

    <br />
    <vm-list max>
      <vm-list-item
        v-for="o in orders"
        :key="o.id"
        :title="transformDue(o.due)"
        :description="getDescription(o)"
      >
        <vm-progress
          slot="media"
          type="ring"
          :progress="getStatus(o)"
          :ringSize="20"
          :ringWidth="3"
          :title="getStatus(o, 100) + '%'"
        />
      </vm-list-item>
    </vm-list>
    <br />
    <vm-title subtitle="einzelne" title="Produkte" />
    <br />
    <vm-list>
      <vm-list-item
        v-for="p in products"
        :key="p.id + p.productId"
        :title="p.amount + 'x ' + p.name"
        :description="transformDue(p.due)"
      >
        <vm-checkbox slot="action" />
      </vm-list-item>
    </vm-list>
  </div>
</template>

<script lang="ts">
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Order, OrderManager, OrderProduct } from '@/utils/OrderManager';
import { ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';
import { VMSelectSelection } from 'vuement';

type OProduct = Order & OrderProduct & { name: string };

@Component
export default class Orders extends Vue {
  public selectedBakeries: string[] = [];

  private get allOrders(): Order[] {
    return OrderManager.orders;
  }

  public get orders(): Order[] {
    return this.allOrders.filter((x) =>
      x.products.some((p) => this.selectedBakeries.includes(p.bakeryId))
    );
  }

  public get uniqueBakeries(): Bakery[] {
    const bakeries = this.allOrders
      .map((x) => x.products.map((x) => x.bakeryId).flat())
      .flat();
    return BakeryManager.bakeries.filter((x) => bakeries.includes(x.id));
  }

  public selection(selection: VMSelectSelection[]): void {
    this.selectedBakeries = selection.filter((x) => x.state).map((x) => x.id);
  }

  public transformDue(due: number): string {
    return Intl.DateTimeFormat('de-de', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(due);
  }

  public getStatus(order: Order): number {
    const { products } = order;
    const _ = (products: OrderProduct[]): number => {
      return products.map((x) => x.amount).reduce((a, b) => a + b, 0);
    };
    const status = _(products.filter((x) => x.done)) / _(products);
    return Math.round(status * 1000) / 1000;
  }

  public getDescription(order: Order): string {
    const { products } = order;
    const status = Math.round(this.getStatus(order) * 100);
    const total = products.map((x) => x.amount).reduce((a, b) => a + b, 0);
    return `(${status}%) ${total} Produkte`;
  }

  get products(): OProduct[] {
    const products: OProduct[] = [];
    this.orders.forEach((o) => {
      o.products.forEach((p) => {
        products.push({
          ...p,
          ...o,
          name: ProductManager.getProduct(p.productId).name,
        });
      });
    });
    return products;
  }
}
</script>

<style lang="scss" scoped>
.view-orders {
  .vm-list[max] {
    max-height: 200px;
    overflow: auto;
  }
}
</style>
