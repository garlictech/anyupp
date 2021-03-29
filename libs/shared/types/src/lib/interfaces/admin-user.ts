import { EAdminRole } from '../enums';
import { IAmplifyModel } from './amplify';

export interface IAdminUserSettings {
  selectedChainId?: string | null;
  selectedGroupId?: string | null;
  selectedUnitId?: string | null;
  selectedProductCategoryId?: string | null;
  selectedLanguage?: string | null;
  selectedHistoryDate?: number | null;
}

export interface IAdminUser
  extends IAmplifyModel {
  id?: string;
  name?: string;
  profileImage?: string;
  role?: EAdminRole; // Filled from token
  settings?: IAdminUserSettings;
}
