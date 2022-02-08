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
        <div>{{ productCount }}</div>
        <span>Produkte</span>
      </section>
      <section stats>
        <bi-euro icon />
        <div>{{ $price($getTotal(orders)) }}€</div>
        <span>Bestellwert</span>
      </section>
    </vm-grid>

    <br />
    <vm-list max>
      <vm-list-item
        v-for="o in orders"
        :key="o.id"
        :title="$due(o.due)"
        :description="$description(o)"
        @click="$store.commit('dialog_order_details', o)"
      >
        <vm-progress
          slot="media"
          type="ring"
          :progress="$status(o)"
          :ringSize="20"
          :ringWidth="3"
          :title="$status(o) + '%'"
        />
      </vm-list-item>
    </vm-list>
    <br />

    <vm-title subtitle="einzelne" title="Produkte" />
    <vm-segment v-model="timespan">
      <vm-segment-item title="Tag" />
      <vm-segment-item title="Woche" />
    </vm-segment>
    <br />

    <div>
      <span v-for="pl in products" :key="pl.title">
        <br />
        <vm-title :subtitle="pl.title" />
        <br />
        <vm-list>
          <vm-list-item
            v-for="p in pl.products"
            :key="p.id"
            :title="p.name"
            :description="p.amount + ' Stk'"
          >
            <vm-avatar slot="media" :src="p.images[0].src" />
          </vm-list-item>
        </vm-list>
      </span>
    </div>

    <BHSDialogOrderDetails />
  </div>
</template>

<script lang="ts">
import BHSDialogOrderDetails from '@/components/dialogs/BHDialogOrderDetails.vue';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { getWeek } from '@/utils/Functions';
import { Order, OrderManager } from '@/utils/OrderManager';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';
import { VMSelectSelection } from 'vuement';

@Component({ components: { BHSDialogOrderDetails } })
export default class Orders extends Vue {
  public selectedBakeries: string[] = [];
  public timespan = 0;
  public selection(selection: VMSelectSelection[]): void {
    this.selectedBakeries = selection.filter((x) => x.state).map((x) => x.id);
  }

  public get orders(): Order[] {
    return OrderManager.orders.filter((x) =>
      x.products.some((p) => this.selectedBakeries.includes(p.bakeryId))
    );
  }

  public get productCount(): number {
    return this.orders
      .map((o) => o.products.map((p) => p.amount).reduce((a, b) => a + b, 0))
      .reduce((a, b) => a + b, 0);
  }

  public get uniqueBakeries(): Bakery[] {
    const bakeries = OrderManager.orders
      .map((x) => x.products.map((x) => x.bakeryId).flat())
      .flat();
    return BakeryManager.bakeries.filter((x) => bakeries.includes(x.id));
  }

  private getTitle(due: number): string {
    const date = new Date(due);
    if (this.timespan === 0) {
      return Intl.DateTimeFormat('de-de', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
    }
    return 'KW' + getWeek(date) + ' ' + date.getFullYear();
  }

  get products(): {
    title: string;
    products: (Product & { amount: number })[];
  }[] {
    type prodObj = Record<string, Record<string, Product & { amount: number }>>;
    const _ = (id: string): Product => ProductManager.getProduct(id);
    return Object.entries(
      this.orders
        .map((o) => {
          const title = this.getTitle(o.due);
          return o.products.map((p) => {
            return { id: p.productId, amount: p.amount, title: title };
          });
        })
        .flat()
        .reduce((acc: prodObj, value) => {
          const { title, id, amount } = value;
          if (!acc[title]) acc[title] = {};
          if (!acc[title][id]) acc[title][id] = { ..._(id), amount: amount };
          else acc[title][id].amount += amount;
          return acc;
        }, {})
    ).map(([key, value]) => {
      return { title: key, products: Object.values(value) };
    });
  }
}
</script>

<style lang="scss" scoped>
.view-orders {
  .vm-list[max] {
    max-height: 400px;
    overflow: auto;
  }
  .vm-select {
    max-width: calc(90vw - 200px);
  }
}
</style>
