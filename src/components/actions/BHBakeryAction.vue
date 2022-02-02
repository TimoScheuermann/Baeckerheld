<template>
  <span v-if="bakery" class="bh-bakery-action" @click.capture.prevent>
    <vm-action :title="bakery.name">
      <vm-action-item
        title="Namen bearbeiten"
        icon="ti-pencil"
        @click="$store.commit('dialog_edit_bakery_name', bakery)"
      />
      <vm-action-item
        title="Öffnungszeiten ändern"
        icon="ti-calendar"
        @click="$store.commit('dialog_edit_bakery_opening_hours', bakery)"
      />
      <vm-action-item
        title="Adresse ändern"
        icon="ti-map-pin"
        @click="$store.commit('dialog_edit_bakery_address', bakery)"
      />
      <vm-spacer />
      <vm-action-item
        title="Löschen"
        icon="ti-trashcan-alt"
        color="error"
        @click="$store.commit('dialog_delete_bakery', bakery)"
      />
    </vm-action>
  </span>
</template>

<script lang="ts">
import { Bakery } from '@/utils/BakeryManager';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class BHBakeryAction extends Vue {
  @Prop() bakery!: Bakery;
}
</script>

<style lang="scss" scoped>
.bh-bakery-action {
  //
}
</style>
