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

export interface IAssignedEntityNames {
  chainName?: string;
  groupName?: string;
  unitName?: string;
}

export interface IAdminUserRole {
  role: EAdminRole;
  entities: IAdminRoleEntity[];
}

export interface IAdminUserCredential {
  roles?: IAdminUserRole;
  settings?: IAdminUserSettings;
}

export interface IAdminUser extends IContact, IAdminUserCredential {
  _id?: string;
  name?: string;
  profileImage?: string;
}
