<template>
  <div class="view-home">
    <vm-title title="Übersicht" subtitle="Allgemein" />
    <br />
    <vm-grid width="130" gap="20">
      <section stats>
        <bi-bakery icon />
        <div>{{ $store.getters.bakeries.length }}</div>
        <span>Bäckereien</span>
      </section>
      <section stats>
        <bi-calendar icon />
        <div>{{ $store.getters.orders.length }}</div>
        <span>Bestellungen</span>
      </section>
      <section stats>
        <bi-cart icon />
        <div>{{ $store.getters.products.length }}</div>
        <span>Produkte</span>
      </section>
      <section stats>
        <bi-euro icon />
        <div>{{ $getTotal($store.getters.orders) }}€</div>
        <span>Bestellwert</span>
      </section>
    </vm-grid>
    <br />
    <vm-title title="Aktionen" subtitle="Schnell" />
    <br />
    <vm-list>
      <vm-list-item
        title="Bäckerei erstellen"
        @click="$store.commit('dialog_create_bakery', true)"
      >
        <bi-bakery slot="media" width="12px" />
        <bi-chevron-right slot="action" width="12px" />
      </vm-list-item>
      <vm-list-item
        title="Produkt registrieren"
        @click="$store.commit('dialog_select_bakery', true)"
      >
        <bi-cart slot="media" width="12px" />
        <bi-chevron-right slot="action" width="12px" />
      </vm-list-item>
    </vm-list>

    <BHDialogSelectBakery />
  </div>
</template>

<script lang="ts">
import BHDialogSelectBakery from '@/components/dialogs/BHDialogSelectBakery.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    BHDialogSelectBakery,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.view-home {
}
</style>
