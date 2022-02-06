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
        <div>{{ $items(products) }}</div>
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
    <br />
    <!-- <vm-list>
      <vm-list-item
        v-for="p in products"
        :key="p.id + p.productId"
        :title="p.amount + 'x ' + p.name"
        :description="$due(p.due)"
      >
        <vm-checkbox
          slot="action"
          :value="p.done"
          @input="updateOrder(p.id, p.bakeryId, p.orderIndex)"
        />
      </vm-list-item>
    </vm-list> -->

    <BHSDialogOrderDetails />
  </div>
</template>

<script lang="ts">
import BHSDialogOrderDetails from '@/components/dialogs/BHDialogOrderDetails.vue';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Order, OrderManager, OrderProduct } from '@/utils/OrderManager';
import { ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';
import { VMSelectSelection } from 'vuement';

type OProduct = Order & OrderProduct & { name: string };

@Component({ components: { BHSDialogOrderDetails } })
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

  public mount = Date.now() + 1000 * 2;
  public updateOrder(
    orderId: string,
    bakeryId: string,
    orderIndex: number
  ): void {
    if (this.mount >= Date.now()) return;
    OrderManager.updateIndex(orderId, bakeryId, orderIndex);
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
