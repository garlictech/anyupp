import { EntityState } from '@ngrx/entity';

import { IAdminUser } from '@bgap/shared/types/interfaces';

export type IAdminUserEntityState = EntityState<IAdminUser>;

export interface IAdminUserListState {
  adminUsers: IAdminUserEntityState;
}
