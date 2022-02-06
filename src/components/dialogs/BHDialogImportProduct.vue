<template>
  <vm-dialog
    class="bh-dialog-import-product"
    v-model="$store.state[key]"
    title="Produkt importieren"
    @input="setDto"
  >
    <vm-spinner slot="button" size="6px" v-if="importing" />
    <vm-accordion>
      <vm-accordion-item
        v-for="(v, bId) in products"
        :key="bId"
        :title="v.bakery.name"
      >
        <vm-list>
          <vm-list-item
            v-for="p in v.products"
            :key="p.id"
            :title="p.name"
            :description="p.price + '€'"
            @click="importProduct(p)"
          >
            <vm-avatar :src="p.images[0].src" slot="media" />
            <bi-plus slot="action" width="16px" />
          </vm-list-item>
        </vm-list>
      </vm-accordion-item>
    </vm-accordion>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { sendNotification } from '@/utils/Functions';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

type ProductList = Record<
  string,
  { bakery: Bakery | null; products: Product[] }
>;

@Component
export default class BHDialogImportProduct extends Vue {
  public key = 'dialog_import_product';
  public bakery: Bakery | null = null;

  public setDto(): void {
    this.bakery = this.$store.state.bakery;
    if (!this.bakery) this.close();
  }

  get products(): ProductList {
    const bakeryIds = new Set(ProductManager.products.map((x) => x.bakeryId));
    if (this.bakery) bakeryIds.delete(this.bakery.id);
    const products: ProductList = {};
    bakeryIds.forEach((b) => {
      products[b] = {
        bakery: BakeryManager.getBakery(b),
        products: ProductManager.getProducts(b),
      };
    });

    return products;
  }

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });
  }

  public close(): void {
    this.$store.commit(this.key, false);
  }

  public importing = false;
  public importProduct(product: Product): void {
    if (this.importing || !this.bakery) return;
    this.importing = true;
    backend
      .post('product/' + this.bakery.id, product)
      .then(({ data }) => {
        ProductManager.storeProducts([data]);

        sendNotification({
          title: 'Import erfolgreich',
          text: `Das Produkt ${product.name} wurde erfolgreich in ${this.bakery?.name} importiert`,
          image: product.images[0].src,
        });
        this.close();
      })
      .catch(({ message }) => {
        sendNotification({
          title: 'Es ist ein Fehler aufgetreten',
          text: message,
        });
      })
      .finally(() => {
        this.importing = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.bh-dialog-import-product {
  //
}
</style>
