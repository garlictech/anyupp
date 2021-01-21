import { IContact } from './contact';

export interface IFacebookInfo {
  accountId: string;
}

export interface IGoogleInfo {
  accountName: string;
}

export interface ISocialInfo {
  facebook: IFacebookInfo;
  google: IGoogleInfo;
}

export interface IUser extends IContact {
  _id: string;
  name: string;
  social: ISocialInfo;
  profileImage: string;
}
