import { EntityState } from '@ngrx/entity';

import { IAdminUser } from '@bgap/shared/types';

export type IAdminUserEntityState = EntityState<IAdminUser>;

export interface IAdminUserListState {
  adminUsers: IAdminUserEntityState;
}
