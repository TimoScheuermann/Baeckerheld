<template>
  <vm-dialog
    class="bh-dialog-delete-bakery"
    v-model="$store.state[key]"
    title="Bäckerei löschen"
    @input="setDto"
  >
    <span v-if="bakery">
      Bist du dir sicher, dass du die Bäckerei mit dem Namen "{{ bakery.name }}"
      löschen möchtest?
    </span>

    <template slot="footer">
      <vm-dialog-button title="Abbrechen" color="color" />
      <vm-dialog-button title="Löschen" @click="deleteBakery" color="error" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import backend from '@/utils/Backend';
import { Bakery, BakeryManager } from '@/utils/BakeryManager';
import { sendNotification } from '@/utils/Functions';
import { noop } from 'vue-class-component/lib/util';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHDialogDeleteBakery extends Vue {
  public key = 'dialog_delete_bakery';
  public bakery: Bakery | null = null;

  public setDto(): void {
    this.bakery = this.$store.state.bakery;
    if (!this.bakery) this.close();
  }

  public async deleteBakery(): Promise<void> {
    if (!this.bakery) return;
    const { id } = this.bakery;
    backend
      .delete('bakery/' + id)
      .catch((err) => {
        sendNotification({ title: 'Es ist ein Fehler aufgetreten', text: err });
      })
      .then(() => {
        BakeryManager.removeBakery(id);
      });

    this.$router.push({ name: 'bakeries' }).catch(noop);
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
.bh-dialog-delete-bakery {
  //
}
</style>
