<template>
  <vm-dialog
    class="bh-dialog-order-details"
    v-model="$store.state[key]"
    title="Bestellungs Details"
    @input="setDto"
  >
    <template v-if="order">
      <vm-title :subtitle="'Für ' + $due(order.due)" center />
      <br />
      <vm-flow>
        <div class="stat">
          <bi-euro height="44px" />
          <span>{{ $price(order) }}€</span>
          <div>Preis</div>
        </div>
        <div class="stat">
          <vm-progress
            type="ring"
            :progress="$status(order)"
            :ringSize="40"
            :ringWidth="6"
            :title="$status(order) + '%'"
          />
          <span>{{ $round($status(order) * 100) }}%</span>
          <div>Status</div>
        </div>
        <div class="stat">
          <bi-cart height="44px" />
          <span>{{ $items(order) }}</span>
          <div>Produkte</div>
        </div>
      </vm-flow>

      <template v-if="products && products.length > 0">
        <br />
        <vm-title subtitle="Produkte" />
        <br />
        <vm-list>
          <vm-list-item
            v-for="p in products"
            :key="p.orderIndex"
            :title="p.amount + 'x ' + p.name"
            :description="$due(p.due)"
          >
            <vm-avatar slot="media" :src="p.images[0].src" />
            <vm-checkbox
              slot="action"
              :value="p.done"
              @input="updateOrder(p.bakeryId, p.orderIndex)"
            />
          </vm-list-item>
        </vm-list>
      </template>
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Order, OrderManager, OrderProduct } from '@/utils/OrderManager';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHSDialogOrderDetails extends Vue {
  public key = 'dialog_order_details';
  public order: Order | null = null;
  public products: (Product & OrderProduct)[] = [];

  public setDto(): void {
    this.products = [];
    this.order = this.$store.state.order;
    this.mount = Date.now() + 1000 * 2;
    if (!this.order) this.close();
    else {
      this.products = this.order.products.map((x) => {
        return { ...x, ...ProductManager.getProduct(x.productId) };
      });
    }
  }

  public mount = Date.now() + 1000 * 2;
  public updateOrder(bakeryId: string, orderIndex: number): void {
    if (!this.order) return;
    if (this.mount >= Date.now()) return;
    OrderManager.updateIndex(this.order.id, bakeryId, orderIndex);
  }

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });
  }

  public close(): void {
    this.$store.commit(this.key, false);
  }
}
</script>

<style lang="scss" scoped>
.bh-dialog-order-details {
  //
  .stat {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1 1 0px;
    svg {
      color: rgba(var(--vm-primary), 1);
    }

    span ~ div {
      font-weight: 500;
      font-size: 0.8em;
      text-transform: uppercase;
      color: rgba(var(--vm-color-secondary), 1);
    }
    span {
      padding-top: 10px;
      padding-bottom: 5px;
      font-weight: bold;
      font-size: 1.2em;
    }
  }
}
</style>
