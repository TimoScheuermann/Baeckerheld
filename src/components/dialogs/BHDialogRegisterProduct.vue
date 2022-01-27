<template>
  <vm-dialog class="bh-dialog-register-product" v-model="$store.state[key]">
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Registrieren" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogRegisterProduct extends Vue {
  public key = 'dialog_register_product';

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
.bh-dialog-register-product {
  //
}
</style>
