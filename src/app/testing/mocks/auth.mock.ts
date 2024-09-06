import { UserAuthData } from '@/core/models/auth.model';

export default class MockAuthService {
  signup(data: UserAuthData) {
    return data;
  }

  signin(data: UserAuthData) {
    return data;
  }

  logout() {}
}
