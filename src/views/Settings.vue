<template>
  <div class="view-settings">
    <div>
      <vm-title title="Einstellungen" />
      <br />
      <vm-title subtitle="Name" />
      <vm-divider />
      <form @submit.prevent="updateName">
        <vm-grid gap="0 10px" width="120" mode="auto-fit">
          <div v-for="(v, k) in general" :key="v">
            <div class="form-input-title">{{ v }}</div>
            <vm-input
              :placeholder="$store.getters.user[k]"
              :disabled="sending"
              v-model="dto[k]"
            />
          </div>
        </vm-grid>
        <br />
        <vm-button
          :block="true"
          :disabled="sending"
          title="Änderungen speichern"
          @click="updateName"
        />
      </form>

      <br />
      <vm-title subtitle="Adresse" />
      <vm-divider />
      <form @submit.prevent="updateAddress">
        <vm-grid gap="0 10px" width="120" mode="auto-fit">
          <div v-for="(v, k) in address" :key="v">
            <div class="form-input-title">{{ v }}</div>
            <vm-input
              :type="k === 'zip' ? 'number' : 'text'"
              :placeholder="$store.getters.user[k]"
              :disabled="sending"
              v-model="dto[k]"
            />
          </div>
        </vm-grid>
        <br />
        <vm-button
          :block="true"
          :disabled="sending"
          title="Änderungen speichern"
          @click="updateAddress"
        />
      </form>
      <br />

      <vm-title subtitle="Erscheinungsbild" />
      <vm-divider />
      <div class="form-input-title">Darkmode</div>
      <vm-checkbox
        v-model="isDark"
        @input="toggleTheme"
        :title="isDark ? 'Ausschalten' : 'Einschalten'"
      />

      <div class="form-input-title" margbot>Primär Farbe</div>
      <vm-grid width="40" gap="10">
        <div
          v-for="c in colors"
          :key="c.name"
          @click="setPrimary(c.hex)"
          class="avatar"
        >
          <vm-avatar
            :src="`https://www.colorbook.io/imagecreator.php?hex=${c.hex}&width=1&height=1`"
          />
        </div>
      </vm-grid>
    </div>

    <vm-flow>
      <vm-button
        size="medium"
        title="Abmelden"
        background="error"
        @click="signOut"
      />
    </vm-flow>
  </div>
</template>

<script lang="ts">
import { Authenticator } from '@/utils/Authenticator';
import backend from '@/utils/Backend';
import { sendNotification } from '@/utils/Functions';
import { SettingsUtils } from '@/utils/SettingsUtils';
import axios from 'axios';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {
  public colors = [
    { name: 'Standard', hex: 'f0973f' },
    { name: 'Lavendel', hex: '6E7BFB' },
    { name: 'Blau', hex: '66BFFF' },
    { name: 'Rot', hex: 'e74c3c' },
    { name: 'Grün', hex: '27ae60' },
    { name: 'Violet', hex: 'D980FA' },
  ];
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

  public isDark = SettingsUtils.dark;
  public toggleTheme(): void {
    SettingsUtils.setTheme(this.isDark ? 'dark' : 'light');
  }

  public setPrimary(color: string): void {
    SettingsUtils.setPrimary(color);
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

  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 50px;

  [margbot] {
    margin-bottom: 3px;
  }

  .avatar {
    transition: 0.2s ease-in-out;
    &:hover {
      transform: scale(0.7);
    }
  }
}
</style>
