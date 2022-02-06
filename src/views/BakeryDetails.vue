<template>
  <div class="view-bakery-details">
    <template v-if="bakery">
      <vm-flow>
        <vm-title subtitle="Einstellungen" :title="bakery.name" />
        <BHBakeryAction :bakery="bakery" />
      </vm-flow>
      <br />

      <vm-grid>
        <section stats>
          <bi-calendar icon />
          <span>Öffnungszeiten</span>
          <table>
            <tr v-for="(value, key, index) in bakery.openingHours" :key="index">
              <td>{{ $getDayName(key) }}</td>
              <td>{{ value }}</td>
            </tr>
          </table>
        </section>

        <section stats>
          <bi-bakery icon />
          <span>Adresse</span>
          <table>
            <tr>
              <td>Straße</td>
              <td>{{ bakery.street }} {{ bakery.streetNumber }}</td>
            </tr>
            <tr>
              <td>Stadt</td>
              <td>{{ bakery.zip }} {{ bakery.city }}</td>
            </tr>
            <tr>
              <td>Lat</td>
              <td v-if="bakery.location && bakery.location.coordinates">
                {{ bakery.location.coordinates[0] }}
              </td>
            </tr>
            <tr>
              <td>Long</td>
              <td v-if="bakery.location && bakery.location.coordinates">
                {{ bakery.location.coordinates[1] }}
              </td>
            </tr>
          </table>
        </section>
      </vm-grid>
      <br />
      <template v-if="products">
        <vm-flow>
          <vm-title subtitle="Übersicht" title="Produkte" />
          <vm-flow>
            <vm-button
              round
              background="color"
              color="background"
              @click="$store.commit('dialog_import_product', bakery)"
            >
              <bi-download height="16px" button-icon />
              <span button-label>import</span>
            </vm-button>
            <vm-button
              round
              @click="$store.commit('dialog_register_product', bakery)"
            >
              <bi-plus height="16px" />
            </vm-button>
          </vm-flow>
        </vm-flow>
        <br />
        <div v-if="products.length === 0">
          Für diese Bäckerei wurden noch keine Produkte registriert
        </div>
        <vm-list>
          <vm-list-item
            v-for="p in products"
            :key="p.id"
            :title="p.name"
            :description="p.price + '€'"
            @click="$store.commit('dialog_edit_product', p)"
          >
            <vm-avatar :src="p.images[0].src" slot="media" />
            <vm-action slot="action" :title="p.name">
              <vm-action-item
                title="Bearbeiten"
                icon="ti-pencil"
                @click="$store.commit('dialog_edit_product', p)"
              />
              <vm-action-item
                title="Löschen"
                icon="ti-trashcan-alt"
                color="error"
                @click="$store.commit('dialog_delete_product', p)"
              />
            </vm-action>
          </vm-list-item>
        </vm-list>
      </template>
    </template>

    <BHDialogImportProduct />
  </div>
</template>

<script lang="ts">
import BHBakeryAction from '@/components/actions/BHBakeryAction.vue';
import BHDialogImportProduct from '@/components/dialogs/BHDialogImportProduct.vue';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { MetaInjector } from '@/utils/MetaInjector';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { BHBakeryAction, BHDialogImportProduct } })
export default class BakeryDetails extends Vue {
  mounted(): void {
    if (this.bakery) {
      MetaInjector.setPageTitle(this.bakery.name);
    } else {
      this.$router.push({ name: 'bakeries' });
    }
  }

  get bakery(): Bakery | null {
    return BakeryManager.getBakery();
  }

  get products(): Product[] {
    return ProductManager.getProducts();
  }
}
</script>

<style lang="scss" scoped>
.view-bakery-details {
  section {
    text-align: left;

    table {
      margin-top: 5px;
    }
  }

  [button-icon] {
    margin-left: 0.5em;
  }
  span[button-label] {
    margin: 0 0.5em;
    font-weight: 500;
  }
}
</style>
