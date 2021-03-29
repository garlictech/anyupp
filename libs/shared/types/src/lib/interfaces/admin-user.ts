import { EAdminRole } from '../enums';
import { IAmplifyModel } from './amplify';
import { IContact } from './contact';

export interface IAdminUserSettings {
  selectedChainId?: string | null;
  selectedGroupId?: string | null;
  selectedUnitId?: string | null;
  selectedProductCategoryId?: string | null;
  selectedLanguage?: string | null;
  selectedHistoryDate?: number | null;
}

// TODO remove?
export interface IAdminRoleEntity {
  chainId: string;
  groupId?: string;
  unitId?: string;
}

// TODO remove?
export interface IAssignedEntityNames {
  chainName?: string;
  groupName?: string;
  unitName?: string;
}

// TODO remove?
export interface IAdminUserCredential {

}

export interface IAdminUser
  extends IAmplifyModel {
  id?: string;
  name: string;
  profileImage?: string;
  role?: EAdminRole; // Filled from token
  settings?: IAdminUserSettings;
}
