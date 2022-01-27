<template>
  <vm-dialog
    class="bh-dialog-edit-bakery-address"
    v-model="$store.state[key]"
    title="Adresse ändern"
    @input="setDto"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />

    <form @submit.prevent="updateBakery" v-if="bakery">
      <div class="form-input-title">Straße und Hausnummer</div>
      <div class="grid">
        <vm-input :placeholder="bakery.street" v-model="dto.street" />
        <vm-input
          :placeholder="bakery.streetNumber"
          v-model="dto.streetNumber"
        />
      </div>
      <div class="form-input-title">PLZ und Stadt</div>
      <div class="grid b">
        <vm-input type="number" :placeholder="bakery.zip" v-model="dto.zip" />
        <vm-input :placeholder="bakery.city" v-model="dto.city" />
      </div>

      <div class="form-input-title">Längengrad</div>
      <vm-input
        type="number"
        :placeholder="bakery.location ? bakery.location.coordinates[0] : ''"
        v-model="lat"
      />
      <div class="form-input-title">Breitengrad</div>
      <vm-input
        type="number"
        :placeholder="bakery.location ? bakery.location.coordinates[1] : ''"
        v-model="long"
      />
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
export default class BHDialogEditBakeryAddress extends Vue {
  public key = 'dialog_edit_bakery_address';
  public dto: Record<string, string | number> = {};
  public bakery: Bakery | null = null;
  public lat: string | number = '';
  public long: string | number = '';

  public setDto(): void {
    this.dto = {
      street: '',
      streetNumber: '',
      zip: '',
      city: '',
    };
    this.lat = '';
    this.long = '';

    this.bakery = this.$store.state.bakery;
    if (this.bakery && this.bakery.openingHours) {
      const { street, streetNumber, zip, city, location } = this.bakery;
      if (street) this.dto.street = street;
      if (streetNumber) this.dto.streetNumber = streetNumber;
      if (zip) this.dto.zip = zip;
      if (city) this.dto.city = city;
      if (location) {
        this.lat = location.coordinates[0];
        this.long = location.coordinates[1];
      }
    }
  }

  public async updateBakery(): Promise<void> {
    if (!this.bakery) return;
    const la = this.lat;
    const lo = this.long;

    const { data } = await backend.patch(
      'bakery/' + this.bakery.id + '/address',
      this.dto
    );
    BakeryManager.storeBakeries([data]);

    if (!isNaN(+la) && !isNaN(+lo)) {
      let res = await backend.patch(
        'bakery/' + this.bakery.id + '/coordinates',
        { coordinates: [+la, +lo] }
      );

      BakeryManager.storeBakeries([res.data]);
    }
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
.bh-dialog-edit-bakery-address {
  .grid {
    display: grid;
    grid-template-columns: 1fr 100px;
    &.b {
      grid-template-columns: 100px 1fr;
    }
  }
}
</style>
