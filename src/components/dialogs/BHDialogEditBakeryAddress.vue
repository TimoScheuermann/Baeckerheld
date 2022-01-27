<template>
  <vm-dialog
    class="bh-dialog-edit-bakery-address"
    v-model="$store.state[key]"
    title="Adresse ändern"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Speichern" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogEditBakeryAddress extends Vue {
  public key = 'dialog_edit_bakery_address';

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
.bh-dialog-edit-bakery-address {
  //
}
</style>
