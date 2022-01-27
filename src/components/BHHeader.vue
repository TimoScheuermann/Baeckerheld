<template>
  <vm-navbar
    v-if="$store.getters.user"
    class="bh-header"
    :title="$store.getters.title"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class BHHeader extends Vue {}
</script>

<style lang="scss" scoped>
.bh-header {
  //
}
</style>
