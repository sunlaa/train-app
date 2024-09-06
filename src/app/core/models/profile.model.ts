import { Role } from './auth.model';

export type ProfileModel = {
  role: Role;
  name: string;
  email: string;
};
