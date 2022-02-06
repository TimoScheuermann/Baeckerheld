<template>
  <div id="app">
    <vm-notification />
    <BHRouter />
    <BHTabbar />
    <BHHeader />
    <BHUpdateAvailable v-model="updateAvailable" @refresh="refresh" />

    <BHDialogCreateBakery />
    <BHDialogDeleteBakery />

    <BHDialogRegisterProduct />
    <BHDialogEditProduct />

    <BHDialogEditBakeryAddress />
    <BHDialogEditBakeryOpeningHours />
    <BHDialogEditBakeryName />>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import BHRouter from './components/BHRouter.vue';
import BHUpdateAvailable from './components/BHUpdateAvailable.vue';
import BHTabbar from './components/BHTabbar.vue';
import BHHeader from './components/BHHeader.vue';
import BHDialogCreateBakery from './components/dialogs/BHDialogCreateBakery.vue';
import BHDialogRegisterProduct from './components/dialogs/BHDialogRegisterProduct.vue';
import BHDialogEditBakeryName from './components/dialogs/BHDialogEditBakeryName.vue';
import BHDialogEditBakeryOpeningHours from './components/dialogs/BHDialogEditBakeryOpeningHours.vue';
import BHDialogEditBakeryAddress from './components/dialogs/BHDialogEditBakeryAddress.vue';
import BHDialogEditProduct from './components/dialogs/BHDialogEditProduct.vue';
import BHDialogDeleteBakery from './components/dialogs/BHDialogDeleteBakery.vue';

@Component({
  components: {
    BHRouter,
    BHUpdateAvailable,
    BHTabbar,
    BHHeader,
    BHDialogCreateBakery,
    BHDialogRegisterProduct,
    BHDialogEditBakeryAddress,
    BHDialogEditBakeryOpeningHours,
    BHDialogEditBakeryName,
    BHDialogEditProduct,
    BHDialogDeleteBakery,
  },
})
export default class App extends Vue {
  public registration: ServiceWorkerRegistration | null = null;
  public updateAvailable = false;
  public refreshing = false;

  created(): void {
    document.addEventListener(
      'serviceWorkerUpdateEvent',
      (e) => {
        const reg = e as CustomEvent<ServiceWorkerRegistration>;
        this.registration = reg.detail;
        this.updateAvailable = true;
      },
      { once: true }
    );

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  }

  public refresh(): void {
    this.updateAvailable = false;
    if (this.registration) {
      this.registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}
</script>

<style lang="scss">
html {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
    'Timos Design', 'Helvetica Neue', 'Segoe UI', Roboto, Arial, 'noto sans',
    'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji',
    sans-serif;
  scroll-behavior: smooth;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  margin: 0;
  @include bh-scrollbar();
}

* {
  -webkit-overflow-scrolling: touch;
}

[content] {
  width: calc(90vw - env(safe-area-inset-left) - env(safe-area-inset-right));

  padding-left: calc(5vw + env(safe-area-inset-left));
  padding-right: calc(5vw + env(safe-area-inset-right));
  padding-top: calc(20px + 50px + env(safe-area-inset-top));
  padding-bottom: calc(20px + 50px + env(safe-area-inset-bottom));

  transition: 0.2s ease-in-out;
  max-width: $max-width;
  margin: 0 auto;
}

[cursor] {
  cursor: pointer;
}

[center] {
  text-align: center;
}

[highlight] {
  color: rgba(var(--vm-primary), 1);
}

a {
  text-decoration: none;
  color: rgba(var(--vm-primary), 1);
  &:hover {
    text-decoration: underline;
  }
}

a.icon-link {
  display: flex;
  width: fit-content;
  align-items: flex-end;
  white-space: nowrap;
  flex-wrap: nowrap;
  i {
    margin-left: 0.2em;
    font-size: 0.6em;
    margin-bottom: 0.1em;
  }
}

form {
  display: flex;
  flex-direction: column;
}
.form-input-title {
  color: rgba(var(--vm-color-secondary), 1);
  padding: 5px 5px 0;
  font-size: 0.8em;
  font-weight: 500;
}

.vm-notifications {
  z-index: 4000 !important;
}

.vm-list {
  // --vm-background: var(--vm-paragraph);
}

section {
  color: rgba(var(--vm-color), 1);
  padding: 20px;
  border-radius: $border-radius;
  background: rgba(var(--vm-paragraph), 1);
  text-align: center;

  position: relative;

  &[stats] {
    overflow: hidden;
    svg[icon] {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      color: rgba(var(--vm-color-secondary), 0.2);
      height: 5em;
    }

    div {
      position: relative;
      color: rgba(var(--vm-primary), 1);
      font-size: 2em;
      font-weight: bold;
    }

    span {
      position: relative;
      font-weight: 600;
      font-size: 0.8em;
      text-transform: uppercase;
    }
  }
}
</style>
