<template>
  <div class="view-login">
    <vm-dialog class="dialog" :value="true" :closeable="false">
      <vm-title title="Bäcker - Dashboard" subtitle="Anmeldung" />
      <br />
      <form @submit.prevent="login" autocomplete="on">
        <div class="form-input-title">E-Mail</div>
        <vm-input
          :disabled="sending"
          type="email"
          autocomplete="email"
          size="medium"
          v-model="dto.email"
        />
        <div class="form-input-title">Passwort</div>
        <vm-input
          :disabled="sending"
          type="password"
          autocomplete="password"
          size="medium"
          v-model="dto.password"
        />
        <br />
        <vm-button
          :disabled="sending"
          title="Anmelden"
          size="medium"
          @click="login"
        />
      </form>
    </vm-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import backend from '@/utils/Backend';
import { Authenticator } from '@/utils/Authenticator';
import { sendNotification } from '@/utils/Functions';

@Component
export default class Login extends Vue {
  public sending = false;

  public dto = {
    email: '',
    password: '',
  };

  public login(): void {
    this.sending = true;

    backend
      .post('auth/login', this.dto)
      .then(({ data }) => {
        Authenticator.signIn(data);
      })
      .catch(() => {
        sendNotification({
          title: 'Falscher Login',
          text: 'E-Mail und Passwort stimmen nicht überein',
        });
      })
      .finally(() => {
        this.sending = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.view-login {
  background-image: url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80');
  background-size: cover;
  background-position: center;
  max-width: unset;
}
</style>
