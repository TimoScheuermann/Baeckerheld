import store from '@/store';
import backend, { backendUrl } from './Backend';
import { sendNotification } from './Functions';
import { User } from './UserManager';

export class Authenticator {
  private static extractUser(token: string): User {
    const base64Url = (token || 'A.B.C').split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  private static async validate(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      fetch(backendUrl + 'auth/valid', {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            this.signIn(token);
            resolve(true);
            return;
          }
          this.signOut();
        })
        .catch(() => {
          this.signOut();
          resolve(false);
        });
    });
  }

  public static test(): void {
    const token = localStorage.getItem('bh-token');
    if (token) this.validate(token);
  }

  public static signOut(): void {
    localStorage.removeItem('bh-token');
    store.commit('signOut');
  }

  public static signIn(token: string): void {
    const user = this.extractUser(token);
    if (user.group !== 'baker') {
      sendNotification({
        title: 'Falscher Login',
        text: 'Dieser versuchte Login ist kein Bäcker',
      });
      return;
    }
    localStorage.setItem('bh-token', token);
    backend.patch('user/name').then(({ data }) => {
      store.commit('user', data);
    });

    store.commit('signIn', user);
  }
}
