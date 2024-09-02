import { Role } from '@/features/auth/models/user-auth-data.model';

export type ProfileModel = {
  role: Role;
  name: string;
  email: string;
};
