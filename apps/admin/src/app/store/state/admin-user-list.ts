import { EntityState } from '@ngrx/entity';

import { IAdminUser } from '../../shared/interfaces';

export type IAdminUserEntityState = EntityState<IAdminUser>;

export interface IAdminUserListState {
  adminUsers: IAdminUserEntityState;
}
