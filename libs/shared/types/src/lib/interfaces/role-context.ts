import { ILocalizedItem } from './localized-item';
import * as CrudApi from '@bgap/crud-gql/api';

export interface IRoleContext {
  id: string;
  contextId: string;
  name: ILocalizedItem<string>;
  role: CrudApi.Role;
  chainId: string;
  groupId?: string;
  unitId?: string;
  userIds?: string[];
}
