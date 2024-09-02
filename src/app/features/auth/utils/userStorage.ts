import { ProfileModel } from '@/core/models/profile.model';

class UserStorage {
  private static authToken = 'token';

  private static userToken = 'user';

  public static getUser(): ProfileModel | null {
    const json = localStorage.getItem(this.userToken);
    return json ? JSON.parse(json) : null;
  }

  public static setUser(user: ProfileModel) {
    localStorage.setItem(this.userToken, JSON.stringify(user));
  }

  public static getAuthToken() {
    return localStorage.getItem(this.authToken);
  }

  public static setAuthToken(token: string) {
    localStorage.setItem(this.authToken, token);
  }

  public static clear() {
    localStorage.clear();
  }
}

export default UserStorage;
