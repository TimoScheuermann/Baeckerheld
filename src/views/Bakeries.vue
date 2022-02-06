<template>
  <div class="view-bakeries">
    <vm-flow>
      <vm-title title="Übersicht" subtitle="Bäckereien" />
      <vm-flow>
        <vm-button round @click="$store.commit('dialog_create_bakery', true)">
          <bi-plus height="16px" />
        </vm-button>
      </vm-flow>
    </vm-flow>
    <br />
    <div v-if="bakeries.length === 0">
      Du hast noch keine Bäckereien erstellt.
    </div>

    <vm-list>
      <vm-list-item
        v-for="b in bakeries"
        :key="b.id"
        :to="{ name: 'bakery-details', params: { id: b.id } }"
        :title="b.name"
        :description="$address(b)"
      />
    </vm-list>
  </div>
</template>

<script lang="ts">
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Bakeries extends Vue {
  get bakeries(): Bakery[] {
    return BakeryManager.bakeries;
  }
}
</script>

<style lang="scss" scoped>
.view-bakeries {
}
</style>
