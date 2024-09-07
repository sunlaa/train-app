import { UserAuthData } from '@/core/models/auth.model';

export default class MockAuthService {
  get userToken() {
    return '';
  }

  signup(data: UserAuthData) {
    return data;
  }

  signin(data: UserAuthData) {
    return data;
  }

  logout() {}
}
