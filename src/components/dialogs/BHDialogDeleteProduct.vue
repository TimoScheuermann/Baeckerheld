<template>
  <vm-dialog
    class="bh-dialog-delete-product"
    v-model="$store.state[key]"
    title="Produkt löschen"
    @input="setDto"
  >
    <span v-if="product">
      Bist du dir sicher, dass du das Produkt
      <span highlight>
        <b>{{ product.name }}</b> ({{ product.description }})
      </span>
      löschen möchtest?
    </span>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Löschen" @click="deleteProduct" color="error" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Product, ProductManager } from '@/utils/ProductManager';
import { sendNotification } from '@/utils/Functions';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogDeleteProduct extends Vue {
  public key = 'dialog_delete_product';
  public product: Product | null = null;

  public setDto(): void {
    this.product = this.$store.state.product;
    if (!this.product) this.close();
  }

  public async deleteProduct(): Promise<void> {
    if (!this.product) return;
    const { id, bakeryId } = this.product;
    backend
      .delete('product/' + bakeryId + '/' + id)
      .catch((err) => {
        sendNotification({ title: 'Es ist ein Fehler aufgetreten', text: err });
      })
      .then(() => {
        ProductManager.removeProduct(id);
      });
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
.bh-dialog-delete-product {
  //
}
</style>
