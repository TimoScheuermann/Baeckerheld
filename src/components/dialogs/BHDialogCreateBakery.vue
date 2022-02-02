<template>
  <vm-dialog
    class="bh-dialog-create-bakery"
    v-model="$store.state[key]"
    title="Bäckerei erstellen"
  >
    <form @submit.prevent="createBakery">
      <div class="form-input-title">Name der Bäckerei</div>
      <vm-input v-model="dto.name" />
    </form>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button
        title="Erstellen"
        @click="createBakery"
        :disabled="dto.name.length < 2"
      />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { BakeryManager } from '@/utils/BakeryManager';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogCreateBakery extends Vue {
  public key = 'dialog_create_bakery';
  public dto = { name: '' };

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });
  }

  public close(): void {
    this.$store.commit(this.key, false);
  }

  public async createBakery(): Promise<void> {
    const { data } = await backend.post('bakery', this.dto);
    BakeryManager.storeBakeries([data]);
    this.$router.push({ name: 'bakery-details', params: { id: data.id } });
  }
}
</script>

<style lang="scss" scoped>
.bh-dialog-create-bakery {
  //
}
</style>
