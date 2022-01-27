<template>
  <vm-dialog
    class="bh-dialog-edit-bakery-name"
    v-model="$store.state[key]"
    title="Namen bearbeiten"
    @input="setDto"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />

    <form @submit.prevent="updateBakery">
      <div class="form-input-title">Neuer Name der Bäckerei</div>
      <vm-input v-model="dto.name" :placeholder="bakery ? bakery.name : ''" />
    </form>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button
        :disabled="dto.name.length < 2"
        title="Speichern"
        @click="updateBakery"
      />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { MetaInjector } from '@/utils/MetaInjector';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogEditBakeryName extends Vue {
  public key = 'dialog_edit_bakery_name';
  public dto = { name: '' };
  public bakery: Bakery | null = null;

  public setDto(): void {
    this.bakery = this.$store.state.bakery;
    if (this.bakery) this.dto.name = this.bakery.name;
  }

  public async updateBakery(): Promise<void> {
    if (!this.bakery) return;
    const { data } = await backend.patch(
      'bakery/' + this.bakery.id + '/name',
      this.dto
    );
    MetaInjector.setPageTitle(data.name);
    BakeryManager.storeBakeries([data]);
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
.bh-dialog-edit-bakery-name {
  //
}
</style>
