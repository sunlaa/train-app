import { TUser } from '@/core/models/users.model';

export class MockProfileData {
  static users: Record<string, TUser> = {
    admin: {
      id: 1,
      email: 'admin@admin.com',
      name: 'Admin',
      role: 'manager',
    },
    user: {
      id: 2,
      email: 'totallylegit@gmail.com',
      name: 'John',
      role: 'user',
    },
  };
}
