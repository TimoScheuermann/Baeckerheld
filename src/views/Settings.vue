<template>
  <div class="view-settings">
    <vm-title title="Einstellungen" />
    <br />

    <vm-grid>
      <div>
        <vm-title subtitle="Name" />
        <vm-divider />
        <form @submit.prevent="updateName">
          <template v-for="(v, k) in general">
            <div class="form-input-title" :key="v">{{ v }}</div>
            <vm-input
              :key="k"
              :placeholder="$store.getters.user[k]"
              :disabled="sending"
              v-model="dto[k]"
            />
          </template>
          <br />
          <vm-button
            :disabled="sending"
            title="Änderungen speichern"
            @click="updateName"
          />
        </form>
      </div>

      <div>
        <vm-title subtitle="Adresse" />
        <vm-divider />
        <form @submit.prevent="updateAddress">
          <template v-for="(v, k) in address">
            <div class="form-input-title" :key="v">{{ v }}</div>
            <vm-input
              :key="k"
              :type="k === 'zip' ? 'number' : 'text'"
              :placeholder="$store.getters.user[k]"
              :disabled="sending"
              v-model="dto[k]"
            />
          </template>
          <br />
          <vm-button
            :disabled="sending"
            title="Änderungen speichern"
            @click="updateAddress"
          />
        </form>
      </div>
    </vm-grid>

    <br />
    <br />
    <vm-flow>
      <vm-button
        size="medium"
        title="Abmelden"
        variant="opaque"
        @click="signOut"
      />
    </vm-flow>
  </div>
</template>

<script lang="ts">
import { Authenticator } from '@/utils/Authenticator';
import backend from '@/utils/Backend';
import { sendNotification } from '@/utils/Functions';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {
  public general = {
    firstName: 'Vorname',
    lastName: 'Nachname',
  };

  public address = {
    street: 'Straße',
    streetNumber: 'Hausnummer',
    zip: 'PLZ',
    city: 'Stadt',
  };

  public dto = { ...this.$store.getters.user };
  public sending = false;

  public updateName(): void {
    this.sending = true;
    backend
      .patch('user/name', this.dto)
      .then(({ data }) => {
        this.$store.commit('user', data);
        this.msg(
          `Der Name wurde erfolgreich zu ${this.$store.getters.name} geändert`
        );
      })
      .catch((error) => {
        this.msg(JSON.stringify(error));
      })
      .finally(() => {
        this.sending = false;
      });
  }

  public updateAddress(): void {
    this.sending = true;
    backend
      .patch('user/address', this.dto)
      .then(({ data }) => {
        this.$store.commit('user', data);
        this.msg('Neue Adresse erfolgreich gespeichert');
      })
      .catch((error) => {
        this.msg(JSON.stringify(error));
      })
      .finally(() => {
        this.sending = false;
      });
  }

  private msg(message: string): void {
    sendNotification({ title: 'Einstellungen', text: message });
  }

  public signOut(): void {
    Authenticator.signOut();
  }
}
</script>

<style lang="scss" scoped>
.view-settings {
  /deep/ input {
    text-align: left !important;
  }
}
</style>
