<template>
  <vm-dialog
    class="bh-dialog-select-bakery"
    v-model="$store.state[key]"
    title="Bäckerei wählen"
  >
    <vm-list>
      <vm-list-item
        v-for="b in bakeries"
        :key="b.id"
        :title="b.name"
        @click="$store.commit('dialog_register_product', b)"
      >
        <bi-chevron-right slot="action" width="12px" />
      </vm-list-item>
    </vm-list>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogSelectBakery extends Vue {
  public key = 'dialog_select_bakery';

  get bakeries(): Bakery[] {
    return BakeryManager.bakeries;
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
.bh-dialog-select-bakery {
  //
  .vm-list {
    --vm-background: var(--vm-paragraph);
  }
}
</style>
