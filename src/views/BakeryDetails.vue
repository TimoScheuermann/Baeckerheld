<template>
  <div class="view-bakery-details">
    <template v-if="bakery">
      <vm-flow>
        <vm-title subtitle="Einstellungen" :title="bakery.name" />
        <vm-flow>
          <vm-button
            round
            @click="$store.commit('dialog_edit_bakery_name', bakery)"
          >
            <bi-bakery height="16px" />
          </vm-button>
        </vm-flow>
      </vm-flow>
      <br />

      <vm-grid>
        <section stats>
          <vm-button
            round
            variant="transparent"
            color="primary"
            @click="$store.commit('dialog_edit_bakery_opening_hours', bakery)"
          >
            <bi-settings height="16px" />
          </vm-button>
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
          <vm-button
            round
            variant="transparent"
            color="primary"
            @click="$store.commit('dialog_edit_bakery_address', bakery)"
          >
            <bi-settings height="16px" />
          </vm-button>
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
        <vm-grid>
          <section v-for="p in products" :key="p.id">
            <vm-avatar-group>
              <vm-avatar
                v-for="i in p.images"
                :key="i.name"
                :src="i.src"
                :title="i.name"
              />
            </vm-avatar-group>
            <div class="p-name">{{ p.name }}</div>
            <div class="p-price">{{ p.price }}€</div>
            <vm-button round variant="transparent" color="primary">
              <bi-settings height="16px" />
            </vm-button>
          </section>
        </vm-grid>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { MetaInjector } from '@/utils/MetaInjector';
import { Product, ProductManager } from '@/utils/ProductManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
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
    .vm-button {
      position: absolute;
      top: 2px;
      right: 2px;
    }

    .p-name {
      font-weight: 500;
      margin: 10px 0 5px;
    }
    .p-price {
      font-weight: bold;
      color: rgba(var(--vm-color-secondary), 1);
    }
  }
}
</style>
