<template>
  <vm-dialog class="bh-update-available" :value="innerValue" @close="close">
    <vm-flow flow="column">
      <img src="pwa/splash/manifest-icon-512.png" height="60" alt="" />
      <vm-title title="Update verfügbar" />
      <br />
      <span center>
        Update <span highlight>Bäckerheld</span>, um die neuesten Funktionen zu
        nutzen.
      </span>
    </vm-flow>

    <template slot="footer">
      <vm-dialog-button color="color" title="Abbrechen" @click="close" />
      <vm-dialog-button title="Update" @click="$emit('refresh')" />
    </template>
  </vm-dialog>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

@Component
export default class BHUpdateAvailable extends Vue {
  @Prop() value!: boolean;

  public innerValue = !!this.value;

  @Watch('value')
  valueChanged(): void {
    this.innerValue = !!this.value;
  }

  public close(): void {
    this.innerValue = false;
    this.$emit('input', false);
  }
}
</script>

<style lang="scss">
.bh-update-available .vm-dialog {
  max-width: 370px;
  .vm-dialog__content {
    overflow: visible !important;
  }
}
</style>

<style lang="scss" scoped>
.bh-update-available {
  img {
    margin-top: -50px;
    margin-bottom: 15px;
    filter: drop-shadow(4px 8px 20px rgba(var(--vm-primary), 0.4));
    border-radius: 25%;
    // background: rgba(var(--vm-paragraph), 1);
    height: 60px;
  }
}
</style>
