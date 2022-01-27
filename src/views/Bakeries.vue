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
    <vm-grid gap="20">
      <router-link
        v-for="b in bakeries"
        :key="b.id"
        :to="{ name: 'bakery-details', params: { id: b.id } }"
      >
        <section>
          <vm-flow flow="column" vertical="start">
            <div>{{ b.name }}</div>
            <span>{{ getAddress(b) }}</span>
          </vm-flow>
          <bi-chevron-right />
        </section>
      </router-link>
    </vm-grid>
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

  getAddress(b: Bakery): string {
    return [b.street, b.streetNumber, b.zip, b.city]
      .filter((x) => !!x)
      .join(' ');
  }
}
</script>

<style lang="scss" scoped>
.view-bakeries {
  section {
    text-align: left;
    display: grid;
    grid-template-columns: 1fr auto;
    svg {
      height: 16px;
    }

    &[create] {
      background: linear-gradient(135deg, rgba(#fff, 0.1), rgba(#000, 0.1)),
        rgba(var(--vm-primary), 1);
      color: #fff;
    }

    div {
      font-weight: 600;
    }

    span {
      font-weight: normal;
      font-size: 0.9em;
      color: rgba(var(--vm-color-secondary), 1);
    }
  }

  a {
    text-decoration: none;
  }
}
</style>
