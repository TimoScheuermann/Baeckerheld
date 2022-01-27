<template>
  <vm-dialog
    class="bh-dialog-edit-opening-hours"
    v-model="$store.state[key]"
    title="Öffnungszeiten ändern"
    @input="setDto"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />

    <form @submit.prevent="updateBakery" v-if="bakery">
      <template v-for="(v, k, i) in dto">
        <div class="form-input-title" :key="i">{{ $getDayName(k) }}</div>
        <vm-input
          :key="k"
          :placeholder="bakery.openinghours ? bakery.openingHours[k] : ''"
          v-model="dto[k]"
        />
      </template>
    </form>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Speichern" @click="updateBakery" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogEditOpeningHours extends Vue {
  public key = 'dialog_edit_bakery_opening_hours';
  public dto: Record<string, string> = {};
  public bakery: Bakery | null = null;

  public setDto(): void {
    this.dto = {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    };
    this.bakery = this.$store.state.bakery;
    if (this.bakery && this.bakery.openingHours) {
      Object.entries(this.bakery.openingHours).forEach(([key, value]) => {
        this.dto[key] = value;
      });
    }
  }

  public async updateBakery(): Promise<void> {
    if (!this.bakery) return;
    const { data } = await backend.patch(
      'bakery/' + this.bakery.id + '/openinghours',
      this.dto
    );
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
.bh-dialog-edit-opening-hours {
  //
}
</style>
