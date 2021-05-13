import { IContact } from './contact';

export interface IUser extends IContact {
  id: string;
  name: string;
  profileImage: string;
  stripeCustomerId?: string;
}
