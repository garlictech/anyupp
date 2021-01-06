import { EAdminRole } from '../enums';
import { IContact } from './contact';

export interface IAdminUserSettings {
  selectedChainId?: string;
  selectedGroupId?: string;
  selectedUnitId?: string;
  selectedProductCategoryId?: string;
  selectedLanguage?: string;
}

export interface IAdminRoleEntity {
  chainId: string;
  groupId?: string;
  unitId?: string;
}

export interface IAdminUserRole {
  role: EAdminRole;
  entities: IAdminRoleEntity[];
}

export interface IAdminUser extends IContact {
  _id?: string;
  name?: string;
  roles?: IAdminUserRole;
  profileImage?: string;
  settings?: IAdminUserSettings;
}
