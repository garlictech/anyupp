import { EAdminRole } from '../enums';
import { IAmplifyModel } from './amplify';
import { IRoleContext } from './role-context';

export interface IAdminUserSettings {
  selectedChainId?: string | null;
  selectedGroupId?: string | null;
  selectedUnitId?: string | null;
  selectedProductCategoryId?: string | null;
  selectedLanguage?: string | null;
  selectedHistoryDate?: number | null;
}

export interface IAdminUserConnectedRoleContext {
  id: string;
  adminUser: IAdminUser;
  adminUserId: string;
  roleContextId: string;
  roleContext: IRoleContext;
}

export interface IAdminUserConnectedRoleContextList {
  items: IAdminUserConnectedRoleContext[];
}

export interface IAdminUser extends IAmplifyModel {
  id?: string;
  name?: string;
  profileImage?: string;
  role?: EAdminRole; // Filled from token
  roleContexts?: IAdminUserConnectedRoleContextList; // Filled with GQL connection
  settings?: IAdminUserSettings;
}
