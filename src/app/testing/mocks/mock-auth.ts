import { UserAuthData } from '@/features/auth/models/user-auth-data.model';

export default class MockAuthService {
  signup(data: UserAuthData) {
    return data;
  }

  signin(data: UserAuthData) {
    return data;
  }

  logout() {}
}
