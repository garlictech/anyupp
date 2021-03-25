import { EAdminRole } from '../enums';
import { ILocalizedItem } from './localized-item';

export interface IRoleContext {
  id: string;
  contextId: string;
  name: ILocalizedItem<string>;
  role: EAdminRole;
  chainId: string;
  groupId?: string;
  unitId?: string;
  userIds?: string[];
}
