import { ProfileModel } from '@/core/models/profile.model';

export default class MockUsersStorage {
  static getUser() {}

  static setUser(user: ProfileModel) {
    return user;
  }

  static getAuthToken() {}

  static setAuthToken(token: string) {
    return token;
  }

  static clear() {}
}
