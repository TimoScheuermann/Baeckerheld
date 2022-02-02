<template>
  <vm-dialog class="bh-dialog-edit-product" v-model="$store.state[key]">
    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Speichern" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogEditProduct extends Vue {
  public key = 'dialog_edit_product';

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
.bh-dialog-edit-product {
  //
}
</style>
