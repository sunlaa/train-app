export type AuthResponse = {
  token: string;
};

export interface UserAuthData {
  email: string;
  password: string;
}

export type Role = 'guest' | 'user' | 'manager';
