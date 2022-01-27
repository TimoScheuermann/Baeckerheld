import store from '@/store';

export interface User {
  id: string;
  group: 'baker' | 'user';
  email: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  streetNumber?: string;
  zip?: number;
  city?: string;
}

export class UserManager {
  static get user(): User | null {
    return store.getters.user;
  }
}
